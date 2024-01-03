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
}

export class ReportData {
    timestamp: number;
    gasLimit: string;
    gasPrice: string;
    maxPriorityFeePerGas: string;
    maxFeePerGas: string;
    baseFee: string;
}
