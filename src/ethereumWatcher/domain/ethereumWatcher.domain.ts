import { AutoMap } from '@automapper/classes';
import { AggregateRoot } from '@nestjs/cqrs';
import { Prop, Schema } from '@nestjs/mongoose';
import { Target, GasReport } from './ethereumWatcher.valueobject';

@Schema({
    collection: GasReportDomain.collectionName,
    timestamps: true,
    optimisticConcurrency: true,
})
export class GasReportDomain extends AggregateRoot {
    public static collectionName = 'gasReports';

    @Prop()
    @AutoMap()
    public id: string;

    @Prop(Target)
    @AutoMap(() => Target)
    public target: Target;

    @Prop(GasReport)
    @AutoMap(() => GasReport)
    public gasReport: GasReport;

    @Prop()
    @AutoMap()
    public pushNotification: boolean;

    constructor(
        id: string,
        target: Target,
        gasReport: GasReport,
        pushNotification: boolean,
    ) {
        super();

        this.id = id;
        this.target = target;
        this.gasReport = gasReport;
        this.pushNotification = pushNotification;
    }
}
