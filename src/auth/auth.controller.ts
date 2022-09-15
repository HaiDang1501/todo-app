import { ResponseObject } from './../utils/ResponseObject';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Request,
    Res,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { GetUser } from './decorator';
import { JwtAuthGuard } from './guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() data: CreateUserDto): Promise<User> {
        return this.authService.register(data);
    }

    @Post('login')
    async login(@Body() data: AuthDto, @Request() req, @Response() res) {
        return this.authService.login(data, req, res);
    }

    @Get('logout')
    async logout(@Req() req, @Res() res) {
        return this.authService.logout(req, res);
    }
}
