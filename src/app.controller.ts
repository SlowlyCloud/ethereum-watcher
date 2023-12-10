import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnon } from './facilities/authGard';

@AllowAnon()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('health-check')
    getHealthCheck(): string {
        return 'healthy';
    }

    @Get('ping')
    getPing(): string {
        return 'pong';
    }
}
