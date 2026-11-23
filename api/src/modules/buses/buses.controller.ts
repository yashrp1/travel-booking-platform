import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BusesService } from './buses.service';
import { BusSearchDto } from './dto/bus.dto';

@ApiTags('Buses')
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search intercity buses by origin, destination, and travel date' })
  async searchBuses(@Body() dto: BusSearchDto) {
    return this.busesService.searchBuses(dto);
  }

  @Get('routes/popular')
  @ApiOperation({ summary: 'Get trending and popular bus travel corridors in India' })
  getPopularRoutes() {
    return this.busesService.getPopularRoutes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bus seat layout, amenities, and boarding points' })
  async getBusById(@Param('id') id: string) {
    return this.busesService.getBusById(id);
  }
}
