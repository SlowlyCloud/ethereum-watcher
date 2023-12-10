import {
    WebSocketServer,
    ConnectedSocket,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
    path: '/events',
    transports: ['websocket'],
    allowUpgrades: true,
    cors: {
        origin: '*.flipgod.xyz',
        methods: ['GET', 'POST'],
    },
})
export class WsGateway {
    constructor(private readonly logger: Logger) {}

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('watch')
    watch(@ConnectedSocket() client: WebSocket): any {
        this.logger.log('[watch] receive client: ', client);
    }
}
