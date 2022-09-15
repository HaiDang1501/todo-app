import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from '../../prisma/prisma.service';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, UserPayload } from './types';
import { jwtSecret } from '../utils/constrants';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(data: CreateUserDto): Promise<User> {
        try {
            const { email, password, username } = data;
            //find user has exist in database by email
            const userExist = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (userExist)
                throw new BadRequestException('Email already exists');

            const hashedPassword = await this.hashPassword(password);

            //Create new user
            const result = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    username,
                },
            });
            return result;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async login(data: AuthDto, req: Request, res: Response) {
        try {
            const { email, password } = data;

            //find user has exist in database by email
            const userExist = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!userExist) {
                throw new BadRequestException('Wrong credentials');
            }

            //compare password from input with password for this user in db
            const comparedPassword = await this.comparePassword({
                password,
                hashPassword: userExist.password,
            });
            if (!comparedPassword) {
                throw new BadRequestException('Wrong credentials');
            }

            //sign JWT and return to the user
            const token = await this.signToken({
                userId: userExist.id,
                email: userExist.email,
            });
            if (!token) {
                throw new ForbiddenException('Could not login');
            }
            res.cookie('token', token.access_token, {}); //set up cookie to send token from client
            return res.send({
                token: token.access_token,
            });
        } catch (error) {
            throw error;
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('token');
        return res.send({ message: 'Logged out successfully' });
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }

    async comparePassword(args: {
        password: string;
        hashPassword: string;
    }): Promise<boolean> {
        return bcrypt.compare(args.password, args.hashPassword);
    }

    async signToken(user: UserPayload): Promise<TokenPayload> {
        return {
            access_token: await this.jwt.signAsync(user, {
                secret: jwtSecret,
                expiresIn: '1d',
            }),
        };
    }
}
