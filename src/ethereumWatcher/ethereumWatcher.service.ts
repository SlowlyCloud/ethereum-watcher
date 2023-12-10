import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumWatcherService {
    constructor(
        readonly logger: Logger,
        private readonly commandLocater: CommandBus,
        private readonly configService: ConfigService,
    ) {}
}
