import { Exclude, Expose } from 'class-transformer';

export class GetSubTaskDto {
    @Exclude()
    id: number;

    nameSubTask: string;

    description: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;
}
