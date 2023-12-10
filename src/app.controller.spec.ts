import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { TestingModule } from '@nestjs/testing';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService, Logger],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root:health-check', () => {
        it('should return "healthy"', () => {
            expect(appController.getHealthCheck()).toBe('healthy');
        });
    });

    describe('root:ping', () => {
        it('should return "pong"', () => {
            expect(appController.getPing()).toBe('pong');
        });
    });
});
