export class PendingTransactionEvent {
    constructor(
        public readonly fromAddress: string,
        public readonly toAddress: string,
    ) {}
}
