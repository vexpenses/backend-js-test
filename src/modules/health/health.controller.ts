import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthController {
  @Get()
  healthCheck() {
    return {
      success: true,
      method: 'GET',
      code: 200,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'js-backend-test',
      },
    };
  }
}

