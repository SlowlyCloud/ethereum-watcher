export class TransactionsQuery {
    constructor(
        public readonly address: string,
        public readonly tokenId: string,
    ) {}
}
