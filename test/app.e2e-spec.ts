import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/health-check (GET)', () => {
        return request(app.getHttpServer()).get('/health-check').expect(200);
    });

    it('/ping (GET)', () => {
        return request(app.getHttpServer())
            .get('/ping')
            .expect(200)
            .expect('pong');
    });
});
