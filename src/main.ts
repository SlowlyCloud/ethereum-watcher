import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { AuthGuard } from './facilities/authGard';
import otelSDK from './facilities/tracing';
import { setDependencyContainer } from './utils/dependencyContainer';

async function bootstrap() {
    otelSDK.start();

    const app = await NestFactory.create(AppModule);
    setDependencyContainer(app);

    const config = app.get(ConfigService);

    app.useGlobalGuards(app.get(AuthGuard))
        .useGlobalPipes(new ValidationPipe({ transform: true }))
        .setGlobalPrefix(config.getOrThrow<string>('BASE_PATH'))
        .useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableCors();

    await app.listen(config.get<number>('PORT'));
}

dotenv.config();
bootstrap();
