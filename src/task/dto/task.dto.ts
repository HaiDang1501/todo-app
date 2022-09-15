import { Prisma, SubTask } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

export class GetTaskDto {
    public nameTask: string;

    @Exclude()
    public total: number;

    @Exclude()
    public createdAt: Date;

    @Exclude()
    public updatedAt: Date;

    @Exclude()
    public userId: number;

    // @Exclude()
    public subTasks: SubTask[];

    @Expose()
    get totalSubTask(): number {
        return this.subTasks?.length || null;
    }
}
