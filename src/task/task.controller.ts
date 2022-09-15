import { plainToInstance } from 'class-transformer';
import { UserPayload } from './../auth/types/userPayload';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto, CreateTaskDto, GetTaskDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { JwtAuthGuard } from 'src/auth/guard';
import { Task } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    async create(
        @GetUser() user: UserPayload,
        @Body() data: CreateTaskDto,
    ): Promise<Task> {
        return this.taskService.create(user.userId, data);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserPayload,
        @Body() data: UpdateTaskDto,
    ): Promise<Task> {
        return this.taskService.update(id, user.userId, data);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserPayload,
    ): Promise<Task> {
        return this.taskService.delete(id, user.userId);
    }

    @Get(':id')
    async getTaskById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<GetTaskDto> {
        return plainToInstance(
            GetTaskDto,
            await this.taskService.getTaskById(id),
        );
    }
}
