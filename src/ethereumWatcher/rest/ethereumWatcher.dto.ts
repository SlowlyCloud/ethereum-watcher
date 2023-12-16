import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEthereumAddress,
    IsPositive,
    IsString,
} from 'class-validator';
import { IsInt } from 'class-validator';
import {
    Target as TargetOfDomain,
    GasReport as GasReportOfDomain,
} from '../domain/ethereumWatcher.valueobject';

export class Target {
    @IsEthereumAddress()
    address: string; // ethereum address

    @IsString()
    tokenId: string; // tokenId for the specific ethereum address (aka collection/contract address)
}

export class Args {
    @IsBoolean()
    pushNotification: boolean; // specify whether push notification is needed

    @Type(() => Number)
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
    @AutoMap()
    public id: string;

    @AutoMap(() => TargetOfDomain)
    public target: TargetOfDomain;

    @AutoMap(() => GasReportOfDomain)
    public gasReport: GasReportOfDomain;

    @AutoMap()
    public pushNotification: boolean;
}
