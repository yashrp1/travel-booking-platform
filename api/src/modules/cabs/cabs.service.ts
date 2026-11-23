import { Injectable, NotFoundException } from '@nestjs/common';
import { CabQuoteDto } from './dto/cab-quote.dto';

export interface VehicleItem {
  id: string;
  category: string;
  name: string;
  modelExamples: string;
  registrationNumber?: string;
  seatCapacity: number;
  luggageCapacity: number;
  ac: boolean;
  imageUrl: string;
  baseFarePerKm: number;
  extraKmRate: number;
  driverAllowance: number;
  driverName?: string;
  driverPhone?: string;
  operatorId?: string;
  operatorName?: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  createdAt: string;
}

@Injectable()
export class CabsService {
  private fleet: VehicleItem[] = [
    {
      id: 'cab_hatchback',
      category: 'HATCHBACK',
      name: 'Wagon R or similar',
      modelExamples: 'Maruti WagonR, Celerio, Tata Tiago',
      registrationNumber: 'DL 01 AB 4092',
      seatCapacity: 4,
      luggageCapacity: 2,
      ac: true,
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
      baseFarePerKm: 11.5,
      extraKmRate: 11.5,
      driverAllowance: 300,
      driverName: 'Suresh Kumar',
      driverPhone: '+91 98761 23456',
      operatorId: 'operator_delhi_cabs',
      operatorName: 'Delhi Express Travels',
      status: 'ACTIVE',
      createdAt: '2026-01-15T10:00:00.000Z',
    },
    {
      id: 'cab_sedan',
      category: 'SEDAN',
      name: 'Dzire, Etios or similar',
      modelExamples: 'Maruti Suzuki Dzire, Toyota Etios, Hyundai Aura',
      registrationNumber: 'DL 04 CD 7781',
      seatCapacity: 4,
      luggageCapacity: 3,
      ac: true,
      imageUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600',
      baseFarePerKm: 13.0,
      extraKmRate: 13.0,
      driverAllowance: 300,
      driverName: 'Vikram Singh',
      driverPhone: '+91 98123 45678',
      operatorId: 'operator_delhi_cabs',
      operatorName: 'Delhi Express Travels',
      status: 'ACTIVE',
      createdAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: 'cab_suv',
      category: 'SUV',
      name: 'Ertiga, Carens or similar',
      modelExamples: 'Maruti Suzuki Ertiga, Kia Carens, Renault Triber',
      registrationNumber: 'MH 02 EF 1290',
      seatCapacity: 6,
      luggageCapacity: 4,
      ac: true,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
      baseFarePerKm: 17.5,
      extraKmRate: 17.5,
      driverAllowance: 400,
      driverName: 'Santosh Jadhav',
      driverPhone: '+91 98333 44556',
      operatorId: 'operator_mumbai_fleet',
      operatorName: 'Mumbai Highway Logistics',
      status: 'ACTIVE',
      createdAt: '2026-02-01T10:00:00.000Z',
    },
    {
      id: 'cab_premium_suv',
      category: 'PREMIUM_SUV',
      name: 'Innova Crysta',
      modelExamples: 'Toyota Innova Crysta / Hycross',
      registrationNumber: 'KA 05 GH 9921',
      seatCapacity: 7,
      luggageCapacity: 5,
      ac: true,
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
      baseFarePerKm: 22.0,
      extraKmRate: 22.0,
      driverAllowance: 500,
      driverName: 'Ramesh Gowda',
      driverPhone: '+91 98450 11223',
      operatorId: 'operator_bengaluru_limo',
      operatorName: 'Royal Chauffeur Services',
      status: 'ACTIVE',
      createdAt: '2026-02-10T10:00:00.000Z',
    },
  ];

  async getQuote(dto: CabQuoteDto) {
    // Intercity routing distance calculation
    let estimatedDistanceKm = 240; // Default Delhi -> Agra
    const lowerPickup = dto.pickupLocation.toLowerCase();
    const lowerDrop = dto.dropLocation.toLowerCase();

    if (lowerPickup.includes('mumbai') && lowerDrop.includes('pune')) {
      estimatedDistanceKm = 150;
    } else if (lowerPickup.includes('bengaluru') && lowerDrop.includes('mysuru')) {
      estimatedDistanceKm = 145;
    } else if (lowerPickup.includes('delhi') && lowerDrop.includes('jaipur')) {
      estimatedDistanceKm = 280;
    } else if (dto.tripType === 'RENTAL') {
      estimatedDistanceKm = 80;
    }

    const durationMinutes = Math.round(estimatedDistanceKm * 1.8);

    // Only quote active vehicles approved by platform
    const activeFleet = this.fleet.filter((v) => v.status === 'ACTIVE');

    const vehicleOptions = activeFleet.map((v) => {
      const distanceFare = Math.round(v.baseFarePerKm * estimatedDistanceKm);
      const totalEstimatedFare = distanceFare + v.driverAllowance;

      return {
        ...v,
        estimatedDistanceKm,
        durationMinutes,
        totalEstimatedFare,
        freeCancellationHours: 6,
      };
    });

    return {
      tripType: dto.tripType,
      from: dto.pickupLocation,
      to: dto.dropLocation,
      departureDate: dto.departureDate,
      pickupTime: dto.pickupTime || '07:00 AM',
      estimatedDistanceKm,
      durationMinutes,
      options: vehicleOptions,
    };
  }

  // --- OPERATOR FLEET METHODS ---

  async addOperatorVehicle(payload: Partial<VehicleItem>) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `cab_${(payload.category || 'sedan').toLowerCase()}_${randomSuffix}`;

    const newVehicle: VehicleItem = {
      id,
      category: payload.category || 'SEDAN',
      name: payload.name || 'Swift Dzire or equivalent',
      modelExamples: payload.modelExamples || 'Maruti Suzuki Dzire, Toyota Etios',
      registrationNumber: payload.registrationNumber || `DL ${Math.floor(10 + Math.random() * 89)} XY ${randomSuffix}`,
      seatCapacity: Number(payload.seatCapacity) || 4,
      luggageCapacity: Number(payload.luggageCapacity) || 3,
      ac: payload.ac ?? true,
      imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600',
      baseFarePerKm: Number(payload.baseFarePerKm) || 13.5,
      extraKmRate: Number(payload.extraKmRate) || Number(payload.baseFarePerKm) || 13.5,
      driverAllowance: Number(payload.driverAllowance) || 350,
      driverName: payload.driverName || 'Assigned Chauffeur',
      driverPhone: payload.driverPhone || '+91 98765 43210',
      operatorId: payload.operatorId || 'operator_demo_fleet',
      operatorName: payload.operatorName || 'City Chauffeurs Ltd',
      status: 'PENDING_APPROVAL', // Requires SuperAdmin sign-off to appear on marketplace
      createdAt: new Date().toISOString(),
    };

    this.fleet.unshift(newVehicle);
    return newVehicle;
  }

  async getOperatorVehicles(operatorId?: string) {
    if (operatorId) {
      return this.fleet.filter((v) => v.operatorId === operatorId);
    }
    return this.fleet;
  }

  // --- ADMIN METHODS ---

  async getAllVehiclesForAdmin() {
    return this.fleet;
  }

  async getPendingVehicles() {
    return this.fleet.filter((v) => v.status === 'PENDING_APPROVAL');
  }

  async setVehicleApproval(id: string, decision: 'APPROVE' | 'REJECT', notes?: string) {
    const vehicle = this.fleet.find((v) => v.id === id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (decision === 'APPROVE') {
      vehicle.status = 'ACTIVE';
    } else {
      vehicle.status = 'REJECTED';
      vehicle.rejectionReason = notes || 'Does not meet commercial vehicle transport standards.';
    }
    return vehicle;
  }

  async toggleVehicleStatus(id: string) {
    const vehicle = this.fleet.find((v) => v.id === id);
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    vehicle.status = vehicle.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    return vehicle;
  }
}

