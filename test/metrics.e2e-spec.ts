import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MetricsModule } from '@metrics/metrics.module';

describe('MetricsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MetricsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/metrics (GET) should return Prometheus metrics (text/plain)', async () => {
    const res = await request(app.getHttpServer()).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('# TYPE');
  });

  it('/metrics/increment (GET) should return success response', async () => {
    const res = await request(app.getHttpServer()).get('/metrics/increment');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('/metrics/active-users (GET) should return success response', async () => {
    const res = await request(app.getHttpServer()).get('/metrics/active-users');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
