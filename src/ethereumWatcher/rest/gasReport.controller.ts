import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { OtelMethodCounter } from 'nestjs-otel';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Response } from 'src/share/rest/dto/response.dto';
import { EthereumWatcherService } from '../ethereumWatcher.service';
import { GasReportRequestBody } from './gasReport.dto';

@Controller('v1/gas-report')
export class GasReportController {
    constructor(
        private readonly logger: Logger,
        private readonly commandLocater: CommandBus,
        private readonly queryLocater: QueryBus,
        private readonly ethereumWatcherService: EthereumWatcherService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @Post()
    @OtelMethodCounter()
    async report(@Body() data: GasReportRequestBody) {
        const highestGasReport =
            await this.ethereumWatcherService.getHighestGasReport(data);

        return Response.new(200, 'successful', highestGasReport);
    }

    @Delete(':id')
    @OtelMethodCounter()
    delete(@Param('id') id: string) {
        this.logger.log(`delete gas report with id: ${id}`);
        return Response.new(204, 'successful', null);
    }
}
