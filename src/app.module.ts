import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { SubtaskModule } from './subtask/subtask.module';

@Module({
    imports: [
        //ConfigModule is global
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        TaskModule,
        UserModule,
        SubtaskModule,
    ],
})
export class AppModule {}
