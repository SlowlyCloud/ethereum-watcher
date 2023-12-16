import { AutoMap } from '@automapper/classes';

export class Target {
    @AutoMap()
    address: string;

    @AutoMap()
    tokenId: string;
}

export class GasReport {
    @AutoMap()
    timestamp: number; // timestamp of transaction of present gas fee report

    @AutoMap()
    gasLimit?: string; // bigint, could be null

    @AutoMap()
    gasPrice?: string; // bigint, could be null

    @AutoMap()
    maxPriorityFeePerGas: string; // bigint required

    @AutoMap()
    maxFeePerGas: string; // bigint, required

    @AutoMap()
    baseFee: string; // bigint, required
}
