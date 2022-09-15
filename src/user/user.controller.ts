import { UserPayload } from './../auth/types/userPayload';
import { UpdateUserDto, GetUsersDto, GetUserTasksDto } from './dto';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll(): Promise<GetUsersDto[]> {
        return plainToInstance(GetUsersDto, await this.userService.getAll());
    }

    // @UseGuards(JwtGuard)
    @Get('me')
    async getMyUser(@GetUser() user: UserPayload) {
        return user;
    }

    @Put(':id')
    async updateMyUser(
        @GetUser() user: UserPayload,
        @Param('id', ParseIntPipe) param: number,
        @Body() data: UpdateUserDto,
    ): Promise<User> {
        return this.userService.updateMyUser(user.userId, param, data);
    }

    @Get('me/tasks')
    async getTaskOfUser(
        @GetUser() user: UserPayload,
    ): Promise<GetUserTasksDto[]> {
        return plainToInstance(
            GetUserTasksDto,
            await this.userService.getTaskOfUser(user.userId),
        );
    }
}
