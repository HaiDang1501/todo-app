import { ResponseObject } from './../utils/ResponseObject';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get()
    getUsers(@Req() req): Promise<ResponseObject> {
        return this.userService.getUsers(req);
    }

    // @UseGuards(JwtGuard)
    @Get('me/:id')
    getMyUser(@Param('id') userId, @Req() req) {
        return this.userService.getMyUser(+userId, req);
    }
}
