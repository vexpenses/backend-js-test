import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('User Create (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and get token
    const registerRes = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        company_name: 'Create Test Company',
        company_document_number: '11111111111111',
        user_name: 'Manager User',
        user_document_number: '11111111111',
        email: 'manager@example.com',
        password: '1234',
      });

    authToken = registerRes.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/users - should create a new user', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'New User',
        document_number: '22222222222',
        email: 'newuser@example.com',
        password: 'pass',
        type: 'USER',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBeDefined();
      });
  });
});

