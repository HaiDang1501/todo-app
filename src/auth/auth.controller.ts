import { ResponseObject } from './../utils/ResponseObject';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthDto } from './dto/auth.dto';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { GetUser } from './decorator';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() createUserDto: CreateUserDto): Promise<ResponseObject> {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    login(@Body() authDto: AuthDto, @Req() req, @Res() res) {
        return this.authService.login(authDto, req, res);
    }

    @Get('logout')
    logout(@Req() req, @Res() res) {
        return this.authService.logout(req, res);
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }
}
