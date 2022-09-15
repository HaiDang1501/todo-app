import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    public username: string;

    @IsNotEmpty({ message: 'email is not empty' })
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'password is more than 8 characters long',
    })
    public password: string;
}
