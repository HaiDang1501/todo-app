import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @IsNotEmpty({ message: 'email is not empty' })
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'PassWord is more than 8 characters long',
    })
    public password: string;
}
