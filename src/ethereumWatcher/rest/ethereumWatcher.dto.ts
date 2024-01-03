import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEthereumAddress,
    IsPositive,
    IsString,
    IsInt,
} from 'class-validator';

class Target {
    @IsString()
    type: string; //  type of the target

    @IsEthereumAddress()
    address: string; // ethereum address

    @IsString()
    tokenId: string; // tokenId for the specific ethereum address (aka collection/contract address)

    @IsString({ each: true })
    markets: string[]; // reports from which markets should be included

    @IsString()
    network: string; // ethereum network
}

export class Args {
    @IsBoolean()
    pushNotification: boolean; // specify whether push notification is needed

    @IsInt()
    @IsPositive()
    timeout: number; // in seconds, this field is mandatory when pushNotification is set to true
}

export class GasReportRequestBody {
    @Type(() => Target)
    target: Target;
    @Type(() => Args)
    args: Args;
}

export class GasReportDto {
    id: string;
    target: Target;
    gasReport: ReportData;
    pushNotification: boolean;

    constructor() {}

    setId(id: string) {
        this.id = id;
        return this;
    }

    setTarget(target: Target) {
        this.target = target;
        return this;
    }

    setGasReport(gasReport: ReportData) {
        this.gasReport = gasReport;
        return this;
    }

    setPushNotification(pushNotification: boolean) {
        this.pushNotification = pushNotification;
        return this;
    }
}

export class ReportData {
    timestamp: number;
    gasLimit: string;
    gasPrice: string;
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
    baseFee: string;

    constructor() {}

    setTimestamp(timestamp: number) {
        this.timestamp = timestamp;
        return this;
    }

    setGasLimit(gasLimit: string) {
        this.gasLimit = gasLimit;
        return this;
    }

    setGasPrice(gasPrice: string) {
        this.gasPrice = gasPrice;
        return this;
    }

    setMaxPriorityFeePerGas(maxPriorityFeePerGas: string) {
        this.maxPriorityFeePerGas = maxPriorityFeePerGas;
        return this;
    }

    setMaxFeePerGas(maxFeePerGas: string) {
        this.maxFeePerGas = maxFeePerGas;
        return this;
    }

    setBaseFee(baseFee: string) {
        this.baseFee = baseFee;
        return this;
    }
}
