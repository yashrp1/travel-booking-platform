import { Controller, Get, Post, Put, Patch, Body, Param, Query } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdateRatesDto } from './dto/update-rates.dto';
import { RegisterPartnerDto, LoginPartnerDto, UpdatePartnerServicesDto } from './dto/partner-auth.dto';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  // --- PARTNER AUTHENTICATION & ONBOARDING ---
  @Post('auth/register')
  async register(@Body() dto: RegisterPartnerDto) {
    return this.partnerService.register(dto);
  }

  @Post('auth/login')
  async login(@Body() dto: LoginPartnerDto) {
    return this.partnerService.login(dto);
  }

  @Get('profile')
  async getProfile(@Query('partnerId') partnerId: string) {
    const profile = await this.partnerService.getProfile(partnerId);
    return {
      success: true,
      partner: profile,
    };
  }

  @Patch('services')
  async updateServices(
    @Query('partnerId') partnerId: string,
    @Body() dto: UpdatePartnerServicesDto,
  ) {
    return this.partnerService.updateServices(partnerId, dto.services);
  }

  @Get('overview')
  async getOverview(@Query('partnerId') partnerId?: string) {
    const overview = await this.partnerService.getPartnerOverview(partnerId);
    return {
      success: true,
      data: overview,
    };
  }

  // --- ACCOMMODATIONS (HOTELS / HOMESTAYS / RESORTS / VILLAS) ---
  @Post('properties')
  async createProperty(
    @Body() dto: CreatePropertyDto,
    @Query('partnerId') partnerId?: string,
  ) {
    const property = await this.partnerService.createProperty(dto, partnerId);
    return {
      success: true,
      data: property,
      message: 'Property submitted successfully and queued for Super Admin quality inspection.',
    };
  }

  @Get('properties')
  async getProperties(@Query('partnerId') partnerId?: string) {
    const properties = await this.partnerService.getProperties(partnerId);
    return {
      success: true,
      data: properties,
      count: properties.length,
    };
  }

  @Put('properties/:id/rates')
  async updateRates(@Param('id') id: string, @Body() dto: UpdateRatesDto) {
    const updated = await this.partnerService.updateRates(id, dto);
    return {
      success: true,
      data: updated,
      message: 'Property rates updated successfully.',
    };
  }

  // --- CAB FLEET & TRANSPORT ---
  @Post('vehicles')
  async createVehicle(
    @Body() payload: any,
    @Query('partnerId') partnerId?: string,
  ) {
    const vehicle = await this.partnerService.createVehicle(payload, partnerId);
    return {
      success: true,
      data: vehicle,
      message: 'Vehicle submitted successfully and queued for Super Admin transport compliance inspection.',
    };
  }

  @Get('vehicles')
  async getVehicles(@Query('partnerId') partnerId?: string) {
    const vehicles = await this.partnerService.getVehicles(partnerId);
    return {
      success: true,
      data: vehicles,
      count: vehicles.length,
    };
  }

  // --- BUS ROUTES & INTERCITY COACHES ---
  @Post('buses')
  async createBus(
    @Body() payload: any,
    @Query('partnerId') partnerId?: string,
  ) {
    const bus = await this.partnerService.createBus(payload, partnerId);
    return {
      success: true,
      data: bus,
      message: 'Bus departure route listed successfully and live for guest reservations.',
    };
  }

  @Get('buses')
  async getBuses(@Query('partnerId') partnerId?: string) {
    const buses = await this.partnerService.getBuses(partnerId);
    return {
      success: true,
      data: buses,
      count: buses.length,
    };
  }

  // --- BOOKINGS LEDGER ---
  @Get('bookings')
  async getPartnerBookings(@Query('partnerId') partnerId?: string) {
    const bookings = await this.partnerService.getPartnerBookings(partnerId);
    return {
      success: true,
      data: bookings,
      count: bookings.length,
    };
  }
}
