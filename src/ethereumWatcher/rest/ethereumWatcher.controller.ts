import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { OtelMethodCounter } from 'nestjs-otel';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Response } from 'src/share/rest/dto/response.dto';
import { GasReportDomain } from '../domain/ethereumWatcher.domain';
import { GasReportDto, GasReportRequestBody } from './ethereumWatcher.dto';

@Controller('v1')
export class EthereumWatcherController {
    constructor(
        private readonly logger: Logger,
        private readonly commandLocater: CommandBus,
        private readonly queryLocater: QueryBus,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @Post('gas-report')
    @OtelMethodCounter()
    report(@Body() _data: GasReportRequestBody) {
        const fakeRes = new GasReportDomain(
            'id',
            {
                address: 'address',
                tokenId: 'tokenId',
            },
            {
                timestamp: 123,
                maxPriorityFeePerGas: 'maxPriorityFeePerGas',
                maxFeePerGas: 'maxFeePerGas',
                baseFee: 'baseFee',
            },
            true,
        );
        return Response.success(
            this.mapper.map(fakeRes, GasReportDomain, GasReportDto),
        );
    }

    @Delete('gas-report/:id')
    @OtelMethodCounter()
    delete(@Param('id') id: string) {
        this.logger.log(`delete gas report with id: ${id}`);
        return Response.new(204, 'successful', null);
    }
}
