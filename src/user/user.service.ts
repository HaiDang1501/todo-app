import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ResponseObject } from '../utils/ResponseObject';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUsers(req: Request): Promise<ResponseObject> {
        // const decodedUserInfo = req.user as { sub: string; userName: string };
        const users = await this.prisma.user.findMany({
            select: {
                userName: true,
                passWord: true,
                email: true,
            },
        });
        return {
            message: 'get all user successfully',
            success: true,
            status: 200,
            data: users,
        };
    }

    async getMyUser(userId: number, req: Request) {
        const findUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!findUser) {
            throw new NotFoundException();
        }
        const decodeUser = req.user as { id: number; email: string };
        if (findUser.id !== decodeUser.id) {
            throw new ForbiddenException();
        }
        delete findUser.passWord;
        return findUser;
    }
}
