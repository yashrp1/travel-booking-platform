import { Injectable } from '@nestjs/common';
import { CabsService, VehicleItem } from '../cabs/cabs.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class OperatorService {
  constructor(
    private readonly cabsService: CabsService,
    private readonly bookingsService: BookingsService,
  ) {}

  async createVehicle(dto: CreateVehicleDto): Promise<VehicleItem> {
    return this.cabsService.addOperatorVehicle(dto);
  }

  async getVehicles(operatorId?: string): Promise<VehicleItem[]> {
    return this.cabsService.getOperatorVehicles(operatorId);
  }

  async getOperatorTrips(operatorId?: string) {
    const allBookings = await this.bookingsService.listAllBookings();
    const cabBookings = allBookings.filter((b) => b.category === 'CAB');
    return cabBookings;
  }
}
