import { Injectable, Logger } from '@nestjs/common';
import { WsGateway } from 'src/share/websocket/ws.gateway';

@Injectable()
export class EthereumWatcherWebsocketGateway {
    constructor(
        private readonly ws: WsGateway,
        private readonly logger: Logger,
    ) {}

    todo(): void {
        this.logger.debug(`EthereumWatcherWebsocketGateway::todo`);
        this.ws.server.emit('EW:TODO', {});
    }
}