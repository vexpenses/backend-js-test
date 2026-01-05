import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('Account Register (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpService = app.get(HttpService);

    // Mock banking API calls
    jest.spyOn(httpService, 'post').mockImplementation((url: string) => {
      if (url.includes('/auth/')) {
        return of({
          data: { access_token: 'mock-token' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        } as any);
      }
      return of({
        data: { account_id: 'acc-123', status: 'ACTIVE' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      } as any);
    });

    // Register user
    const registerRes = await request(app.getHttpServer())
      .post('/api/users/register')
      .send({
        company_name: 'Account Test Company',
        company_document_number: '33333333333333',
        user_name: 'Account User',
        user_document_number: '33333333333',
        email: 'account@example.com',
        password: '1234',
      });

    authToken = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/users/:userId/account/register - should register account', () => {
    return request(app.getHttpServer())
      .post(`/api/users/${userId}/account/register`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        account_id: 'test-account-123',
        pin: '1234',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.account).toBeDefined();
      });
  });
});

