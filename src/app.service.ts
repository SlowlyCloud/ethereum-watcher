import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(private readonly logger: Logger) {}

    getHello(): string {
        this.logger.verbose(
            {
                something: 'happened',
                obj: {
                    anything: 'happened',
                },
            },
            'this is a verbose',
        );

        this.logger.debug({ where: 'AppService' }, 'hello is called');

        this.logger.log({ where: 'AppService' }, 'hello is called');

        this.logger.warn('this is a warn');

        this.logger.error(new Error('this is an error.'));

        return 'Hello World!';
    }
}
