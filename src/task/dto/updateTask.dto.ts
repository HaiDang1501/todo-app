import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    public nameTask: string;
}
