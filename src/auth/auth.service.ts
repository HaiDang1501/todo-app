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
import { ResponseObject } from './../utils/ResponseObject';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { jwtSecret } from '../utils/constrants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(createUserDto: CreateUserDto): Promise<ResponseObject> {
        try {
            const { email, password, userName } = createUserDto;
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
            const user = await this.prisma.user.create({
                data: {
                    email,
                    passWord: hashedPassword,
                    userName,
                },
            });
            return {
                message: 'Register successfully',
                status: 200,
                success: true,
                data: user,
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
    }

    async login(authDto: AuthDto, req: Request, res: Response) {
        const { email, password } = authDto;

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
            hashPassword: userExist.passWord,
        });
        if (!comparedPassword) {
            throw new BadRequestException('Wrong credentials');
        }

        //sign JWT and return to the user
        const token = await this.signToken(userExist.id, userExist.email);
        if (!token) {
            throw new ForbiddenException('Could not login');
        }
        res.cookie('token', token, {}); //set up cookie to send token from client
        return res.send({ message: 'Logged in successfully' });
    }

    async logout(req: Request, res: Response) {
        console.log(req.user);
        res.clearCookie('token');
        return res.send({ message: 'Logged out successfully' });
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePassword(args: {
        password: string;
        hashPassword: string;
    }): Promise<boolean> {
        return await bcrypt.compare(args.password, args.hashPassword);
    }

    async signToken(userId: number, email: string): Promise<Tokens> {
        const payload = {
            id: userId,
            email: email,
        };
        return {
            access_token: await this.jwt.signAsync(payload, {
                secret: jwtSecret,
                expiresIn: '60s',
            }),
        };
    }
}
