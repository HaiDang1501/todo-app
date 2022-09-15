import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    public nameTask: string;
}
