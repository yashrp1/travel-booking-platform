import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { HotelSearchDto } from './dto/hotel-search.dto';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('destinations')
  @ApiOperation({ summary: 'Search destinations and popular Indian cities' })
  async getDestinations(@Query('query') query?: string) {
    return this.hotelsService.searchDestinations(query || '');
  }

  @Get('search')
  @ApiOperation({ summary: 'Search hotels via query params' })
  async searchHotelsGet(@Query() query: any) {
    return this.hotelsService.searchHotels({
      destination: query.destination || '',
      checkInDate: query.checkInDate || '',
      checkOutDate: query.checkOutDate || '',
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    });
  }

  @Post('search')
  @ApiOperation({ summary: 'Search hotels with date range, guests, and filters' })
  async searchHotels(@Body() dto: HotelSearchDto) {
    return this.hotelsService.searchHotels(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hotel overview, images, and ratings' })
  async getHotel(@Param('id') id: string) {
    return this.hotelsService.getHotelById(id);
  }

  @Get(':id/rooms')
  @ApiOperation({ summary: 'Get available room rate plans for property' })
  async getRooms(@Param('id') id: string) {
    return this.hotelsService.getRooms(id);
  }
}
