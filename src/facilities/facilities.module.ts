import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { EthersModule, MAINNET_NETWORK } from 'nestjs-ethers';
import { JwtModule } from '@nestjs/jwt';
import * as winston from 'winston';
import { OpenTelemetryModule } from 'nestjs-otel';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { HttpModule } from '@nestjs/axios';
import { WsGateway } from '../share/websocket/ws.gateway';
import { AuthGuard } from './authGard';

@Module({
    imports: [
        WinstonModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                const winstonFormat = [
                    winston.format.timestamp(),
                    winston.format.errors({ stack: true }),
                ];

                switch (config.get<string>('NODE_ENV')) {
                    case 'local':
                        winstonFormat.push(
                            ...[
                                winston.format.colorize(),
                                winston.format.simple(),
                                winston.format.ms(),
                            ],
                        );
                        break;

                    default:
                        winstonFormat.push(...[winston.format.json()]);
                        break;
                }

                return {
                    levels: {
                        verbose: winston.config.cli.levels.verbose,
                        debug: winston.config.cli.levels.debug,
                        info: winston.config.cli.levels.info,
                        warn: winston.config.cli.levels.warn,
                        error: winston.config.cli.levels.error,
                    },
                    silent: false,
                    level: config.get<string>('LOG_LEVEL'),
                    defaultMeta: { app_id: config.get<string>('APP_ID') },
                    exitOnError: false,
                    transports: [
                        new winston.transports.Console({
                            format: winston.format.combine(...winstonFormat),
                        }),
                    ],
                    handleExceptions: true,
                    handleRejections: true,
                };
            },
            inject: [ConfigService],
        }),

        EthersModule.forRootAsync({
            imports: [ConfigModule],
            token: 'normal',
            useFactory: (configService: ConfigService) => ({
                network: MAINNET_NETWORK,
                useDefaultProvider: false,
                alchemy: configService.get<string>('ALCHEMY_API_KEY'),
                etherscan: configService.get<string>('ETHERSCAN_API_KEY'),
                infura: configService.get<string>('INFURA_API_KEY'),
                quorum: 1,
            }),
            inject: [ConfigService],
        }),

        EthersModule.forRootAsync({
            imports: [ConfigModule],
            token: 'flashbots',
            useFactory: (configService: ConfigService) => ({
                network: MAINNET_NETWORK,
                useDefaultProvider: false,
                custom: configService.getOrThrow<string>('RPC_FLASHBOTS'),
            }),
            inject: [ConfigService],
        }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: Buffer.from(
                    configService.getOrThrow<string>('AUTH_SECRET'),
                    'base64',
                ),
                verifyOptions: {
                    algorithms: ['HS512', 'RS512'],
                },
            }),
            inject: [ConfigService],
        }),

        OpenTelemetryModule.forRoot({
            metrics: {
                hostMetrics: true, // Includes Host Metrics
                apiMetrics: {
                    enable: true, // Includes api metrics
                    defaultAttributes: {
                        // Set default labels for api metrics
                        custom: 'label',
                    },
                    ignoreRoutes: ['/favicon.ico'], // Ignoring specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
                    ignoreUndefinedRoutes: false, // Records metrics for all URLs, even undefined ones
                },
            },
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow<string>('MONGO_URI'),
            }),
            inject: [ConfigService],
        }),

        AutomapperModule.forRoot({
            strategyInitializer: classes(),
        }),

        HttpModule,
    ],

    providers: [WsGateway, Logger, AuthGuard],

    exports: [WinstonModule, EthersModule, AuthGuard, HttpModule, Logger],
})
export class FacilitiesModule {}
