import { SubTask } from '@prisma/client';
import { jwtSecret } from 'src/utils/constrants';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable, UseGuards } from '@nestjs/common';
import { ResponseObject } from 'src/utils/ResponseObject';
import { CreateSubTaskDto, UpdateSubTaskDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class SubtaskService {
    constructor(private prisma: PrismaService) {}
    async create(taskId: number, data: CreateSubTaskDto): Promise<SubTask> {
        try {
            const result = await this.prisma.subTask.create({
                data: {
                    nameSubTask: data.nameSubTask,
                    startDate: data.startDate,
                    dueDate: data.dueDate,
                    description: data.description,
                    taskId: taskId,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: UpdateSubTaskDto): Promise<SubTask> {
        try {
            const result = await this.prisma.subTask.update({
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

    async updateStatus(id: number): Promise<SubTask> {
        try {
            const getStatus = await this.prisma.subTask.findUnique({
                where: {
                    id: id,
                },
                select: {
                    status: true,
                },
            });
            const markStatus = !getStatus.status;
            const result = await this.prisma.subTask.update({
                where: {
                    id: id,
                },
                data: {
                    status: markStatus,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<SubTask> {
        try {
            const result = await this.prisma.subTask.delete({
                where: {
                    id: id,
                },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }

    async getSubTaskOfTask(TaskId: number): Promise<SubTask[]> {
        try {
            const result = await this.prisma.subTask.findMany({
                where: {
                    taskId: TaskId,
                },
                // include: {
                //     task: {
                //         select: {
                //             nameTask: true,
                //         },
                //     },
                // },
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}
