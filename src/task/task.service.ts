import { UpdateTaskDto } from './dto';
import { CreateTaskDto } from './dto/createTask.dto';
import { ResponseObject } from './../utils/ResponseObject';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, data: CreateTaskDto): Promise<Task> {
        try {
            const result = await this.prisma.task.create({
                data: {
                    ...data,
                    userId,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(
        id: number,
        userId: number,
        data: UpdateTaskDto,
    ): Promise<Task> {
        try {
            const checkedUser = await this.checkAuth(id);
            if (checkedUser.userId !== userId) {
                throw new ForbiddenException('Unauthorized');
            }
            const result = await this.prisma.task.update({
                where: {
                    id: id,
                },
                data: {
                    ...data,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number, userId: number): Promise<Task> {
        try {
            const checkedUser = await this.checkAuth(id);
            if (checkedUser.userId !== userId) {
                throw new ForbiddenException('Unauthorized');
            }
            const result = await this.prisma.task.delete({
                where: {
                    id: id,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getTaskById(id: number): Promise<Task> {
        try {
            const result = await this.prisma.task.findUnique({
                where: {
                    id: id,
                },
                include: {
                    subTasks: true,
                },
            });
            if (result === null) {
                throw new BadRequestException('data not exists');
            }
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async checkAuth(id: number) {
        try {
            const user = await this.prisma.task.findUnique({
                where: {
                    id: id,
                },
                select: {
                    userId: true,
                },
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}
