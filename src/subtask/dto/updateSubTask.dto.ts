import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UpdateSubTaskDto {
    @IsString()
    public nameSubTask: string;

    @IsString()
    public description: string;

    @IsDate()
    @Type(() => Date)
    public startDate: Date;

    @IsDate()
    @Type(() => Date)
    public dueDate: Date;
}
