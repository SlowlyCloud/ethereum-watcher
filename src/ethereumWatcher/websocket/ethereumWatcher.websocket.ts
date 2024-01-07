import { Injectable, Logger } from '@nestjs/common';
import { WsGateway } from 'src/share/websocket/ws.gateway';

@Injectable()
export class EthereumWatcherWebsocketGateway {
    constructor(
        private readonly ws: WsGateway,
        private readonly logger: Logger,
    ) {}

    pendingTransaction(): void {
        this.logger.debug(`EthereumWatcherWebsocketGateway::GAS_REPORT`);
        this.ws.server.emit('EW:GAS_REPORT', {});
    }
}
