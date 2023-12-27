import { EventsHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { EthereumWatcherWebsocketGateway } from 'src/ethereumWatcher/websocket/ethereumWatcher.websocket';
import { PendingTransactionEvent } from './pendingTransaction.event';
import type { IEventHandler } from '@nestjs/cqrs';

@EventsHandler(PendingTransactionEvent)
export class PendingTransactionHandler
    implements IEventHandler<PendingTransactionEvent>
{
    constructor(
        private readonly ws: EthereumWatcherWebsocketGateway,
        private readonly logger: Logger,
    ) {}

    handle(event: PendingTransactionEvent) {
        this.logger.debug(
            'PendingTransactionHandler::handle: ' + JSON.stringify(event),
        );
        // this.ws.notifyApeBestPriceChanged(event.perviousBestPrice, event.currentBestPrice);
    }
}
