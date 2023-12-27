import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { hexToNumber } from 'web3-utils';
import {
    GasReportDto,
    ReportData,
    type GasReportRequestBody,
} from './rest/ethereumWatcher.dto';

const SEA_PORT_ADDRESS = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC';

// https://docs.alchemy.com/reference/alchemy-pendingtransactions#returns
interface PendingTransaction {
    blockHash: null;
    blockNumber: null;
    from: string;
    gas: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    input: string;
    nonce: string;
    to: string;
    transactionIndex: null;
    value: string;
    type: string;
    v: string;
    r: string;
    s: string;
}

@Injectable()
export class EthereumWatcherService {
    private readonly alchemy: Alchemy;

    constructor(
        readonly logger: Logger,
        private readonly commandLocater: CommandBus,
        private readonly configService: ConfigService,
    ) {
        this.alchemy = new Alchemy({
            apiKey: this.configService.get('ALCHEMY_API_KEY'),
            network: Network.ETH_MAINNET,
        });
    }

    public async getHighestGasReport(data: GasReportRequestBody) {
        const pendingTransactions = await this.collectPendingTransactions(data);
        if (pendingTransactions.length) {
            const highestGasTransaction = pendingTransactions.reduce(
                (prev, curr) => {
                    const prevGasPrice = hexToNumber(prev.gasPrice);
                    const currGasPrice = hexToNumber(curr.gasPrice);
                    return prevGasPrice > currGasPrice ? prev : curr;
                },
            );

            const gasReport = new GasReportDto();
            gasReport.id = highestGasTransaction.hash;
            gasReport.target = data.target;
            const reportData = new ReportData();
            reportData.timestamp = Date.now();
            reportData.gasPrice = highestGasTransaction.gasPrice;
            // TODO: get gasLimit from pending transaction
            reportData.gasLimit = '';
            reportData.maxPriorityFeePerGas =
                highestGasTransaction.maxPriorityFeePerGas;
            reportData.maxFeePerGas = highestGasTransaction.maxFeePerGas;
            // TODO: get baseFee from pending transaction
            reportData.baseFee = '';
            gasReport.gasReport = reportData;
            gasReport.pushNotification = data.args.pushNotification;
            return gasReport;
        }
        return null;
    }

    private collectPendingTransactions(data: GasReportRequestBody) {
        const pendingTransactions: PendingTransaction[] = [];
        const event = {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
            toAddress: SEA_PORT_ADDRESS,
        };

        const pendingTransactionsListener = (
            pendingTransaction: PendingTransaction,
        ) => {
            this.logger.log(
                `PENDING_TRANSACTIONS: `,
                JSON.stringify(pendingTransaction),
            );
            if (this.isDesiredPendingTransaction(pendingTransaction, data)) {
                pendingTransactions.push(pendingTransaction);
            }
        };

        return new Promise<PendingTransaction[]>((resolve) => {
            this.alchemy.ws.on(event, pendingTransactionsListener);

            setTimeout(() => {
                resolve(pendingTransactions);
                this.alchemy.ws.off(event, pendingTransactionsListener);
            }, data.args.timeout * 1000);
        });
    }

    /**
     * TODO: Parsing input data, filtered by address and tokenId
     */
    private isDesiredPendingTransaction(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pendingTransaction: PendingTransaction,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: GasReportRequestBody,
    ) {
        return true;
    }
}
