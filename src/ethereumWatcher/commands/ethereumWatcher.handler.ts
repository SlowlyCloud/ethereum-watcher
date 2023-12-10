import { CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EthereumWatcherCommand } from './ethereumWatcher.command';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(EthereumWatcherCommand)
export class EthereumWatcherHandler
    implements ICommandHandler<EthereumWatcherCommand, any>
{
    constructor(
        private readonly publisher: EventPublisher,
        private readonly logger: Logger,
    ) {}

    // TODO
    // @ts-ignore
    execute(command: EthereumWatcherCommand) {
        this.logger.debug(
            'EthereumWatcherHandle::execute: ' + JSON.stringify(command),
        );
    }
}
