import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    public username: string;

    @IsEmail()
    public email: string;

    @MinLength(8, {
        message: 'password is more than 8 characters long',
    })
    public newPassword: string;
}
