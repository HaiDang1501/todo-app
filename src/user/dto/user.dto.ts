import { Task } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class GetUserTasksDto {
    @Exclude()
    id: number;

    username: string;

    @Exclude()
    password: string;

    email: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude({ toPlainOnly: true })
    tasks: Task[];

    @Expose()
    get countTask(): number {
        return this.tasks.length || null;
    }
}

export class GetUsersDto {
    @Exclude()
    id: number;

    username: string;

    @Exclude()
    password: string;

    email: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;
}
