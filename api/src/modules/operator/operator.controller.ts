import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post('vehicles')
  async createVehicle(@Body() dto: CreateVehicleDto) {
    const vehicle = await this.operatorService.createVehicle(dto);
    return {
      success: true,
      data: vehicle,
      message: 'Vehicle submitted successfully and queued for Super Admin quality inspection.',
    };
  }

  @Get('vehicles')
  async getVehicles(@Query('operatorId') operatorId?: string) {
    const vehicles = await this.operatorService.getVehicles(operatorId);
    return {
      success: true,
      data: vehicles,
      count: vehicles.length,
    };
  }

  @Get('trips')
  async getTrips(@Query('operatorId') operatorId?: string) {
    const trips = await this.operatorService.getOperatorTrips(operatorId);
    return {
      success: true,
      data: trips,
      count: trips.length,
    };
  }
}
