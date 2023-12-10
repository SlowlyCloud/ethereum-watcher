import { Module, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FacilitiesModule } from 'src/facilities/facilities.module';
import { CommandHandlers } from './commands';
import { EthereumWatcherWebsocketGateway } from './websocket/ethereumWatcher.websocket';

@Module({
    imports: [CqrsModule, FacilitiesModule],
    providers: [Logger, ...CommandHandlers, EthereumWatcherWebsocketGateway],
})
export class EthereumWatcherModule {}
