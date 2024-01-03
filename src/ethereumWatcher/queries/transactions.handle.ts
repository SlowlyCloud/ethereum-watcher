import { Logger } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { Alchemy, Network } from 'alchemy-sdk';
import { TransactionsQuery } from './transactions.query';
import type { IQueryHandler } from '@nestjs/cqrs';

@QueryHandler(TransactionsQuery)
export class TransactionsHandler implements IQueryHandler<TransactionsQuery> {
    private readonly alchemy: Alchemy;

    constructor(private readonly logger: Logger) {
        this.alchemy = new Alchemy({
            apiKey: process.env.ALCHEMY_API_KEY,
            network: Network.ETH_MAINNET,
        });
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async execute(query: TransactionsQuery) {
        this.logger.verbose(
            'TransactionsHandler::execute:' + JSON.stringify(query),
        );

        this.logger.verbose(
            'InquiryApeHandle::execute:document:' + JSON.stringify(document),
        );

        return document;
    }
}
