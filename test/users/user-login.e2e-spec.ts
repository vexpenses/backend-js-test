import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('User Login (e2e)', () => {
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

  it('POST /api/users/login - should login with basic auth', async () => {
    // First register a user
    await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        company_name: 'Login Test Company',
        company_document_number: '98765432109876',
        user_name: 'Login User',
        user_document_number: '98765432109',
        email: 'login@example.com',
        password: 'pass',
      });

    // Then login
    return request(app.getHttpServer())
      .post('/api/users/login')
      .auth('login@example.com', 'pass')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
      });
  });
});

