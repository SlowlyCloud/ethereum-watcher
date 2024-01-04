import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { Alchemy, Network, AlchemySubscription } from 'alchemy-sdk';
import { hexToNumber } from 'web3-utils';
import {
    GasReportDto,
    ReportData,
    type GasReportRequestBody,
} from './rest/gasReport.dto';

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
    private pendingTransactions: PendingTransaction[] = [];
    private data: GasReportRequestBody | null = null;

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
        this.data = data;
        const pendingTransactions = await this.collectPendingTransactions();
        if (pendingTransactions.length) {
            const highestGasTransaction = pendingTransactions.reduce(
                (prev, curr) => {
                    const prevGasPrice = hexToNumber(prev.gasPrice);
                    const currGasPrice = hexToNumber(curr.gasPrice);
                    return prevGasPrice > currGasPrice ? prev : curr;
                },
            );

            const reportData = new ReportData()
                .setTimestamp(Date.now())
                .setGasPrice(highestGasTransaction.gasPrice)
                // TODO: get gasLimit from pending transaction
                .setGasLimit('')
                .setMaxPriorityFeePerGas(
                    highestGasTransaction.maxPriorityFeePerGas,
                )
                .setMaxFeePerGas(highestGasTransaction.maxFeePerGas)
                // TODO: get baseFee from pending transaction
                .setBaseFee('');

            const gasReport = new GasReportDto()
                .setId(highestGasTransaction.hash)
                .setTarget(data.target)
                .setGasReport(reportData)
                .setPushNotification(data.args.pushNotification);


            return gasReport;
        }
        return null;
    }

    private collectPendingTransactions() {
        const event = {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
            toAddress: SEA_PORT_ADDRESS,
        };

        return new Promise<PendingTransaction[]>((resolve) => {
            this.alchemy.ws.on(event, this.pendingTransactionsListener);

            setTimeout(() => {
                resolve(this.pendingTransactions);
                this.pendingTransactions = [];
                this.data = null;
                this.alchemy.ws.off(event, this.pendingTransactionsListener);
            }, this.data.args.timeout * 1000);
        });
    }

    /**
     * TODO: Parsing input data, filtered by address and tokenId
     */
    private isDesiredPendingTransaction(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pendingTransaction: PendingTransaction,
    ) {
        return true;
    }

    private pendingTransactionsListener(
        pendingTransaction: PendingTransaction,
    ) {
        this.logger.log(
            `PENDING_TRANSACTIONS: `,
            JSON.stringify(pendingTransaction),
        );
        if (this.isDesiredPendingTransaction(pendingTransaction)) {
            this.pendingTransactions.push(pendingTransaction);
        }
    }
}
