import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { InitiateHotelBookingDto } from './dto/initiate-booking.dto';
import { InitiateCabBookingDto } from './dto/initiate-cab-booking.dto';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('hotels/initiate')
  @ApiOperation({ summary: 'Initiate hotel reservation and obtain Razorpay order' })
  async initiateHotelBooking(@Body() dto: InitiateHotelBookingDto) {
    return this.bookingsService.initiateHotelBooking(dto);
  }

  @Post('cabs/initiate')
  @ApiOperation({ summary: 'Initiate cab reservation and obtain driver assignment' })
  async initiateCabBooking(@Body() dto: InitiateCabBookingDto) {
    return this.bookingsService.initiateCabBooking(dto);
  }

  
  @Post('buses/initiate')
  @ApiOperation({ summary: 'Initiate bus reservation and obtain confirmed PNR voucher' })
  async initiateBusBooking(@Body() dto: any) {
    return this.bookingsService.initiateBusBooking(dto);
  }

@Get('my-bookings')
  @ApiOperation({ summary: 'List customer trip reservations' })
  async getMyBookings() {
    return this.bookingsService.listAllBookings();
  }

  @Get(':reference/invoice')
  @ApiOperation({ summary: 'Generate formal GST tax invoice for a booking' })
  async getInvoice(@Param('reference') reference: string) {
    return this.bookingsService.getBookingInvoice(reference);
  }

  @Get(':reference')
  @ApiOperation({ summary: 'Lookup booking voucher details by reference ID' })
  async getBooking(@Param('reference') reference: string) {
    return this.bookingsService.getBookingByReference(reference);
  }

  @Post(':reference/cancel')
  @ApiOperation({ summary: 'Cancel booking and trigger automated refund' })
  async cancelBooking(
    @Param('reference') reference: string,
    @Body('reason') reason?: string
  ) {
    return this.bookingsService.cancelBooking(reference, reason);
  }

  @Get()
  @ApiOperation({ summary: 'List customer trip reservations' })
  async listBookings() {
    return this.bookingsService.listAllBookings();
  }
}
