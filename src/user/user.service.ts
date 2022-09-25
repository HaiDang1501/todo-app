import { UpdateUserDto } from './dto/updateUser.dto';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getAll(): Promise<User[]> {
        // const decodedUserInfo = req.user as { sub: string; userName: string };
        try {
            const result = await this.prisma.user.findMany({});
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateMyUser(
        id: number,
        param: number,
        data: UpdateUserDto,
    ): Promise<User> {
        try {
            const { username, email, newPassword } = data;
            const findUser = await this.prisma.user.findUnique({
                where: { id: param },
            });
            if (!findUser) {
                throw new NotFoundException();
            }
            if (findUser.id !== id) {
                throw new ForbiddenException();
            }
            const hashPassword = await bcrypt.hash(newPassword, 10);
            const result = await this.prisma.user.update({
                where: {
                    id: findUser.id,
                },
                data: {
                    username,
                    email,
                    password: hashPassword,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getTaskOfUser(id: number): Promise<User[]> {
        try {
            const result = await this.prisma.user.findMany({
                where: {
                    id: id,
                },
                include: {
                    tasks: {
                        include: { subTasks: true },
                    },
                },
            });
            if (result === null) {
                throw new BadRequestException('data not exists');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}
