import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { FacilitiesModule } from './facilities/facilities.module';
import { EthereumWatcherModule } from './ethereumWatcher/ethereumWatcher.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: ['.env/.env.local', '.env/.env.dev', '.env/.env.prod'],
            validationSchema: joi.object({
                NODE_ENV: joi
                    .string()
                    .valid('local', 'development', 'production')
                    .default('local'),
                APP_ID: joi.string().required(),
                PORT: joi.number().default(3000),
                LOG_LEVEL: joi
                    .string()
                    .valid('info', 'debug', 'error', 'warn', 'verbose')
                    .default('info'),
                BASE_PATH: joi
                    .string()
                    .uri({ allowRelative: true })
                    .default('/'),
            }),
        }),
        ScheduleModule.forRoot(),
        FacilitiesModule,
        EthereumWatcherModule,
    ],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule {}
