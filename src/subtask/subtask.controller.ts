import { SubTask } from '@prisma/client';
import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    UseGuards,
    ParseIntPipe,
    Get,
    ClassSerializerInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { CreateSubTaskDto, UpdateSubTaskDto, GetSubTaskDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { plainToInstance } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('subtask')
export class SubtaskController {
    constructor(private readonly subtaskService: SubtaskService) {}

    // @Get(':id')
    // get(
    //     @Param('id', ParseIntPipe) taskId: number,
    //     @Body() data: CreateSubTaskDto,
    // ): Promise<ResponseObject> {
    //     return this.subtaskService.create(taskId, data);
    // }

    @Post(':id')
    async create(
        @Param('id', ParseIntPipe) taskId: number,
        @Body() data: CreateSubTaskDto,
    ): Promise<SubTask> {
        return this.subtaskService.create(taskId, data);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateSubTaskDto,
    ): Promise<SubTask> {
        return this.subtaskService.update(id, data);
    }

    @Put(':id/status') // ':id/status'
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SubTask> {
        return this.subtaskService.updateStatus(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<SubTask> {
        return this.subtaskService.delete(id);
    }

    @Get('/task/:id')
    async getSubTaskOfTask(
        @Param('id', ParseIntPipe) taskId: number,
    ): Promise<GetSubTaskDto[]> {
        return plainToInstance(
            GetSubTaskDto,
            await this.subtaskService.getSubTaskOfTask(taskId),
        );
    }
}
