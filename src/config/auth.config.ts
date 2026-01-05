export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '86400',
  tokenName: process.env.TOKEN_NAME || 'api_token',
};

