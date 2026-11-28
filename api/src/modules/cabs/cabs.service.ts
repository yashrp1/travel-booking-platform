import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

  private mapDbVehicle(v: any): VehicleItem {
    return {
      id: v.id,
      category: v.categoryName || 'SEDAN',
      name: v.name || 'Cab',
      modelExamples: v.modelExamples || 'Commercial Cab',
      registrationNumber: v.registrationNumber,
      seatCapacity: v.seatCapacity || 4,
      luggageCapacity: v.luggageCapacity || 2,
      ac: v.ac ?? true,
      imageUrl: v.imageUrl || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600',
      baseFarePerKm: Number(v.baseFarePerKm) || 12.0,
      extraKmRate: Number(v.extraKmRate) || 12.0,
      driverAllowance: Number(v.driverAllowance) || 300,
      driverName: v.driverName || 'Verified Chauffeur',
      driverPhone: v.driverPhone || '',
      operatorId: v.operatorId || '',
      operatorName: v.operatorName || 'Partner Operator',
      status: (v.status as any) || (v.isActive ? 'ACTIVE' : 'SUSPENDED'),
      createdAt: v.createdAt ? v.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  async getQuote(dto: CabQuoteDto) {
    let estimatedDistanceKm = 240;
    const lowerPickup = (dto.pickupLocation || '').toLowerCase();
    const lowerDrop = (dto.dropLocation || '').toLowerCase();

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

    let activeVehicles: any[] = [];
    try {
      activeVehicles = await this.prisma.cabVehicle.findMany({
        where: { status: 'ACTIVE', isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      activeVehicles = [];
    }

    const options = activeVehicles.map((v) => {
      const mapped = this.mapDbVehicle(v);
      const distanceFare = Math.round(mapped.baseFarePerKm * estimatedDistanceKm);
      const totalEstimatedFare = distanceFare + mapped.driverAllowance;

      return {
        ...mapped,
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
      options,
    };
  }

  // --- OPERATOR FLEET METHODS ---

  async addOperatorVehicle(payload: Partial<VehicleItem>) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `cab_${(payload.category || 'sedan').toLowerCase()}_${randomSuffix}`;
    const regNumber = payload.registrationNumber || `DL ${Math.floor(10 + Math.random() * 89)} XY ${randomSuffix}`;

    const created = await this.prisma.cabVehicle.create({
      data: {
        id,
        categoryName: payload.category || 'SEDAN',
        name: payload.name || 'Commercial Sedan or equivalent',
        modelExamples: payload.modelExamples || 'Maruti Suzuki Dzire, Toyota Etios',
        registrationNumber: regNumber,
        seatCapacity: Number(payload.seatCapacity) || 4,
        luggageCapacity: Number(payload.luggageCapacity) || 3,
        ac: payload.ac ?? true,
        imageUrl: payload.imageUrl || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600',
        baseFarePerKm: Number(payload.baseFarePerKm) || 13.5,
        extraKmRate: Number(payload.extraKmRate) || Number(payload.baseFarePerKm) || 13.5,
        driverAllowance: Number(payload.driverAllowance) || 350,
        driverName: payload.driverName || 'Assigned Chauffeur',
        driverPhone: payload.driverPhone || '+91 98765 43210',
        operatorId: payload.operatorId || 'operator_partner',
        operatorName: payload.operatorName || 'Partner Fleet Solutions',
        status: 'PENDING_APPROVAL',
        isActive: false,
      },
    });

    return this.mapDbVehicle(created);
  }

  async getOperatorVehicles(operatorId?: string) {
    try {
      const whereClause = operatorId ? { operatorId } : {};
      const list = await this.prisma.cabVehicle.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });
      return list.map((v) => this.mapDbVehicle(v));
    } catch {
      return [];
    }
  }

  // --- ADMIN METHODS ---

  async getAllVehiclesForAdmin() {
    try {
      const list = await this.prisma.cabVehicle.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return list.map((v) => this.mapDbVehicle(v));
    } catch {
      return [];
    }
  }

  async getPendingVehicles() {
    try {
      const list = await this.prisma.cabVehicle.findMany({
        where: { status: 'PENDING_APPROVAL' },
        orderBy: { createdAt: 'desc' },
      });
      return list.map((v) => this.mapDbVehicle(v));
    } catch {
      return [];
    }
  }

  async setVehicleApproval(id: string, decision: 'APPROVE' | 'REJECT', notes?: string) {
    const isApproved = decision === 'APPROVE';
    const updated = await this.prisma.cabVehicle.update({
      where: { id },
      data: {
        status: isApproved ? 'ACTIVE' : 'REJECTED',
        isActive: isApproved,
      },
    });
    return this.mapDbVehicle(updated);
  }

  async toggleVehicleStatus(id: string) {
    const vehicle = await this.prisma.cabVehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    const newStatus = vehicle.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await this.prisma.cabVehicle.update({
      where: { id },
      data: {
        status: newStatus,
        isActive: newStatus === 'ACTIVE',
      },
    });
    return this.mapDbVehicle(updated);
  }
}
