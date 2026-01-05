import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('User Registration (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/users/register - should register a new user and company', () => {
    return request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        company_name: 'Test Company',
        company_document_number: '12345678901234',
        user_name: 'Test User',
        user_document_number: '12345678901',
        email: 'test@example.com',
        password: 'test123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.token).toBeDefined();
      });
  });
});

