import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BusSearchDto, CreateBusDto } from './dto/bus.dto';

export interface BusItem {
  id: string;
  operatorName: string;
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  originalFare: number;
  rating: number;
  reviewCount: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  registrationNumber?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  seats?: {
    id: string;
    number: string;
    deck: 'LOWER' | 'UPPER';
    type: 'SLEEPER' | 'SEATER';
    isBooked: boolean;
    fare: number;
  }[];
}

@Injectable()
export class BusesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapDbBus(b: any): BusItem {
    return {
      id: b.id,
      operatorName: b.operatorName,
      busType: b.busType,
      fromCity: b.fromCity,
      toCity: b.toCity,
      departureTime: b.departureTime,
      arrivalTime: b.arrivalTime,
      duration: b.duration,
      fare: Number(b.fare),
      originalFare: Number(b.originalFare) || Math.round(Number(b.fare) * 1.25),
      rating: b.rating || 4.5,
      reviewCount: b.reviewCount || 0,
      totalSeats: b.totalSeats || 40,
      availableSeats: b.availableSeats || 40,
      amenities: Array.isArray(b.amenities) ? b.amenities : ['Water Bottle', 'Charging Point', 'Blankets'],
      boardingPoints: Array.isArray(b.boardingPoints) ? b.boardingPoints : [`${b.fromCity} Main Stand`],
      droppingPoints: Array.isArray(b.droppingPoints) ? b.droppingPoints : [`${b.toCity} Bus Terminal`],
      registrationNumber: b.registrationNumber,
      status: (b.status as any) || 'ACTIVE',
      createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
      seats: this.generateSeats(Number(b.fare), b.totalSeats || 36),
    };
  }

  private generateSeats(baseFare: number, count = 36) {
    const seats: any[] = [];
    for (let i = 1; i <= count; i++) {
      const isUpper = i > count / 2;
      const seatType = isUpper ? 'SLEEPER' : 'SEATER';
      const seatFare = isUpper ? baseFare + 250 : baseFare;
      seats.push({
        id: `seat_${i}`,
        number: `${isUpper ? 'U' : 'L'}${((i - 1) % 18) + 1}`,
        deck: isUpper ? 'UPPER' : 'LOWER',
        type: seatType,
        isBooked: i % 4 === 0,
        fare: seatFare,
      });
    }
    return seats;
  }

  getPopularRoutes() {
    return [
      { from: 'Delhi', to: 'Manali', startingFare: 1199, duration: '11h 30m', busesAvailable: 28 },
      { from: 'Mumbai', to: 'Goa', startingFare: 999, duration: '12h 00m', busesAvailable: 34 },
      { from: 'Bengaluru', to: 'Hyderabad', startingFare: 850, duration: '8h 45m', busesAvailable: 42 },
      { from: 'Pune', to: 'Nagpur', startingFare: 1050, duration: '11h 15m', busesAvailable: 19 },
      { from: 'Chennai', to: 'Bengaluru', startingFare: 650, duration: '6h 30m', busesAvailable: 55 },
    ];
  }

  async searchBuses(dto: BusSearchDto) {
    try {
      const whereClause: any = { status: 'ACTIVE' };
      if (dto.fromCity) {
        whereClause.fromCity = { contains: dto.fromCity, mode: 'insensitive' };
      }
      if (dto.toCity) {
        whereClause.toCity = { contains: dto.toCity, mode: 'insensitive' };
      }

      const list = await this.prisma.bus.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      return {
        from: dto.fromCity,
        to: dto.toCity,
        date: dto.travelDate,
        total: list.length,
        buses: list.map((b) => this.mapDbBus(b)),
      };
    } catch {
      return {
        from: dto.fromCity,
        to: dto.toCity,
        date: dto.travelDate,
        total: 0,
        buses: [],
      };
    }
  }

  async getBusById(id: string) {
    const bus = await this.prisma.bus.findUnique({ where: { id } });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    return this.mapDbBus(bus);
  }

  async createBus(dto: CreateBusDto) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `bus_${dto.operatorName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 10)}_${randomSuffix}`;

    const created = await this.prisma.bus.create({
      data: {
        id,
        operatorName: dto.operatorName,
        busType: dto.busType,
        fromCity: dto.fromCity,
        toCity: dto.toCity,
        departureTime: dto.departureTime,
        arrivalTime: dto.arrivalTime,
        duration: dto.duration || '8h 30m',
        fare: Number(dto.fare),
        originalFare: Math.round(Number(dto.fare) * 1.25),
        rating: 4.8,
        reviewCount: 0,
        totalSeats: Number(dto.totalSeats) || 36,
        availableSeats: Number(dto.totalSeats) || 36,
        amenities: dto.amenities || ['Blanket', 'Charging Point', 'Reading Light'],
        boardingPoints: dto.boardingPoints || [`${dto.fromCity} Main Hub`],
        droppingPoints: dto.droppingPoints || [`${dto.toCity} Central Depot`],
        registrationNumber: dto.registrationNumber || `KA 01 F ${randomSuffix}`,
        status: 'ACTIVE',
      },
    });

    return this.mapDbBus(created);
  }

  async getAllBusesForAdmin() {
    try {
      const list = await this.prisma.bus.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return list.map((b) => this.mapDbBus(b));
    } catch {
      return [];
    }
  }

  async getAllBuses() {
    return this.getAllBusesForAdmin();
  }

  async toggleBusStatus(id: string) {
    const bus = await this.prisma.bus.findUnique({ where: { id } });
    if (!bus) {
      throw new NotFoundException(`Bus with ID ${id} not found`);
    }
    const newStatus = bus.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await this.prisma.bus.update({
      where: { id },
      data: { status: newStatus },
    });
    return this.mapDbBus(updated);
  }

  async deleteBus(id: string) {
    const bus = await this.prisma.bus.delete({ where: { id } });
    return this.mapDbBus(bus);
  }
}
