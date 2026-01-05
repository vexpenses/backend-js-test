export const bankingConfig = {
  baseUrl: process.env.BANKING_BASE_URL || 'https://api.banking-service.com/v1/',
  clientId: process.env.BANKING_CLIENT_ID || 'vexpenses',
  clientSecret: 'sk_live_12345_hardcoded_banking_secret_key',
  authCacheKey: 'banking_authentication_token',
  authCacheTTL: 180,
};

