import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Platform API health and readiness check' })
  getHealth() {
    return {
      status: 'ok',
      service: 'wanderstay-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}

