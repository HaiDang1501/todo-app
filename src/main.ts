import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; //Init TodoApp use Swagger to check API
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: { credentials: true },
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    ); //use validation input data from client

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('Todo App')
        .setDescription('The todo API description')
        .setVersion('1.0')
        .addTag('Todos')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
    await app.listen(3000);
}
bootstrap();
