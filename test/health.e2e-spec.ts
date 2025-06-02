import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HealthModule } from '@health/health.module';
import { RedisHealthIndicator } from '@redis/redis.health';
import { MockRedisHealthIndicator } from './mocks/redis-health.mock';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(RedisHealthIndicator)
      .useClass(MockRedisHealthIndicator)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET) should return 200', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
