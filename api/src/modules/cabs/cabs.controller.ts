import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CabsService } from './cabs.service';
import { CabQuoteDto } from './dto/cab-quote.dto';

@ApiTags('Cabs')
@Controller('cabs')
export class CabsController {
  constructor(private readonly cabsService: CabsService) {}

  @Post('quote')
  @ApiOperation({ summary: 'Calculate route distance, duration and category fares' })
  async getQuote(@Body() dto: CabQuoteDto) {
    return this.cabsService.getQuote(dto);
  }
}
