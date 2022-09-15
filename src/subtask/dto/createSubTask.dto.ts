import { IsDate, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubTaskDto {
    @IsString()
    @IsNotEmpty()
    public nameSubTask: string;

    @IsString()
    @IsNotEmpty()
    public description: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    public startDate: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    public dueDate: Date;
}
