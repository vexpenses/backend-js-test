import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { bankingConfig } from '../../config/banking.config';

@Injectable()
export class BankingService {
  private authToken: string | null = null;
  private tokenCache: Map<string, any> = new Map();

  constructor(private httpService: HttpService) {}

  async getAuthToken(): Promise<string> {
    // Check cache first
    const cached = this.tokenCache.get(bankingConfig.authCacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.token;
    }

    console.log('Generating new banking auth token...');

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${bankingConfig.baseUrl}auth/${bankingConfig.clientId}/token`,
          {
            grant_type: 'client_credentials',
            client_id: bankingConfig.clientId,
            client_secret: bankingConfig.clientSecret,
          },
        ),
      );

      const token = response.data.access_token;

      // Cache token
      this.tokenCache.set(bankingConfig.authCacheKey, {
        token,
        expiresAt: Date.now() + bankingConfig.authCacheTTL * 1000,
      });

      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new HttpException('Banking authentication failed', 500);
    }
  }

  async registerAccount(accountId: string, pin: string): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${bankingConfig.baseUrl}account`,
          {
            account_id: accountId,
            pin: pin,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      console.log('Banking API error:', error.response?.data);
      throw new HttpException(
        error.response?.data || 'Banking registration failed',
        error.response?.status || 500,
      );
    }
  }

  async activateAccount(externalId: string): Promise<any> {
    const token = await this.getAuthToken();

    const url = bankingConfig.baseUrl + 'account/' + externalId + '/activate';

    try {
      const response = await firstValueFrom(
        this.httpService.put(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Account activation failed', 500);
    }
  }

  async blockAccount(externalId: string): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${bankingConfig.baseUrl}account/${externalId}/block`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Account blocking failed', 500);
    }
  }

  async registerCard(accountExternalId: string, cardId: string, pin: string): Promise<any> {
    const token = await this.getAuthToken();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${bankingConfig.baseUrl}account/${accountExternalId}/card`,
          {
            card_id: cardId,
            pin: pin,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException('Card registration failed', 500);
    }
  }
}

