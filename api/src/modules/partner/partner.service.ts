import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { CabsService } from '../cabs/cabs.service';
import { BusesService } from '../buses/buses.service';
import { BookingsService } from '../bookings/bookings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdateRatesDto } from './dto/update-rates.dto';
import { RegisterPartnerDto, LoginPartnerDto } from './dto/partner-auth.dto';

export interface PartnerAccount {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  password?: string;
  services: ('HOTELS' | 'CABS' | 'BUSES')[];
  createdAt: string;
}

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hotelsService: HotelsService,
    private readonly cabsService: CabsService,
    private readonly busesService: BusesService,
    private readonly bookingsService: BookingsService,
  ) {}

  private mapDbPartner(p: any): PartnerAccount {
    return {
      id: p.id,
      businessName: p.businessName,
      contactName: p.contactName,
      email: p.email,
      phone: p.phone,
      services: Array.isArray(p.services) ? (p.services as any) : ['HOTELS'],
      createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  async register(dto: RegisterPartnerDto) {
    const existing = await this.prisma.partner.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('A partner account with this email already exists.');
    }

    if (!dto.services || dto.services.length === 0) {
      throw new BadRequestException('Please select at least one travel service you offer (Hotels or Cabs).');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const partnerId = `ptr_${dto.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}_${randomSuffix}`;

    const newPartner = await this.prisma.partner.create({
      data: {
        id: partnerId,
        businessName: dto.businessName,
        contactName: dto.contactName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        password: dto.password,
        services: dto.services,
      },
    });

    const token = `ptt_${Buffer.from(newPartner.email + ':' + Date.now()).toString('base64')}`;
    return {
      success: true,
      token,
      partner: this.mapDbPartner(newPartner),
    };
  }

  async login(dto: LoginPartnerDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!partner || partner.password !== dto.password) {
      throw new UnauthorizedException('Invalid partner email or password. Please try again.');
    }

    const token = `ptt_${Buffer.from(partner.email + ':' + Date.now()).toString('base64')}`;
    return {
      success: true,
      token,
      partner: this.mapDbPartner(partner),
    };
  }

  async getPartnerById(partnerId: string): Promise<PartnerAccount> {
    const partner = await this.prisma.partner.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partnerId} not found`);
    }

    return this.mapDbPartner(partner);
  }

  async updateServices(partnerId: string, services: ('HOTELS' | 'CABS')[]) {
    const updated = await this.prisma.partner.update({
      where: { id: partnerId },
      data: { services },
    });

    return {
      success: true,
      partner: this.mapDbPartner(updated),
    };
  }

  // --- PARTNER LISTINGS MANAGEMENT ---

  async getProfile(partnerId: string) {
    return this.getPartnerById(partnerId);
  }

  async getPartnerOverview(partnerId?: string) {
    if (!partnerId) {
      return {
        partnerId: 'all',
        businessName: 'Partner Operations',
        services: ['HOTELS', 'CABS'],
        metrics: {
          totalRevenue: 0,
          monthlyRevenue: 0,
          activeListings: 0,
          pendingReview: 0,
          totalBookings: 0,
          averageRating: 4.8,
          occupancyRatePercent: 75,
        },
      };
    }
    return this.getOverview(partnerId);
  }

  async getProperties(partnerId?: string) {
    return this.getPartnerProperties(partnerId);
  }

  async updateRates(id: string, dto: UpdateRatesDto) {
    return this.hotelsService.updatePropertyRates(id, dto);
  }

  async createVehicle(payload: any, partnerId?: string) {
    return this.addVehicle(partnerId || payload.operatorId || 'partner_host', payload);
  }

  async getVehicles(partnerId?: string) {
    return this.getPartnerVehicles(partnerId);
  }

  async createBus(payload: any, partnerId?: string) {
    let operatorName = payload.operatorName;
    if (partnerId) {
      try {
        const partner = await this.getPartnerById(partnerId);
        if (partner && partner.businessName) operatorName = partner.businessName;
      } catch {}
    }
    return this.busesService.createBus({
      ...payload,
      operatorName: operatorName || payload.operatorName || 'Partner Coach Fleet',
    });
  }

  async getBuses(partnerId?: string) {
    return this.busesService.getAllBuses();
  }

  async createProperty(dto: CreatePropertyDto, partnerId?: string) {
    return this.hotelsService.createPartnerProperty({
      ...dto,
      partnerId: partnerId || 'partner_host',
      partnerName: 'Verified Partner Host',
    });
  }

  async updatePropertyRates(partnerId: string, propertyId: string, dto: UpdateRatesDto) {
    await this.getPartnerById(partnerId);
    return this.hotelsService.updatePropertyRates(propertyId, dto);
  }

  async addVehicle(partnerId: string, dto: any) {
    const partner = await this.getPartnerById(partnerId);
    return this.cabsService.addOperatorVehicle({
      ...dto,
      operatorId: partner.id,
      operatorName: partner.businessName,
    });
  }

  async getPartnerProperties(partnerId: string) {
    await this.getPartnerById(partnerId);
    return this.hotelsService.getPartnerProperties(partnerId);
  }

  async getPartnerVehicles(partnerId: string) {
    await this.getPartnerById(partnerId);
    return this.cabsService.getOperatorVehicles(partnerId);
  }

  async getPartnerBookings(partnerId: string) {
    await this.getPartnerById(partnerId);
    return [];
  }

  async getOverview(partnerId: string) {
    const partner = await this.getPartnerById(partnerId);
    const properties = await this.hotelsService.getPartnerProperties(partnerId);
    const vehicles = await this.cabsService.getOperatorVehicles(partnerId);

    const activeListings =
      properties.filter((p) => p.status === 'ACTIVE').length +
      vehicles.filter((v) => v.status === 'ACTIVE').length;

    const pendingReview =
      properties.filter((p) => p.status === 'PENDING_APPROVAL').length +
      vehicles.filter((v) => v.status === 'PENDING_APPROVAL').length;

    return {
      partnerId: partner.id,
      businessName: partner.businessName,
      services: partner.services,
      metrics: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        activeListings,
        pendingReview,
        totalBookings: 0,
        averageRating: 4.8,
        occupancyRatePercent: 78,
      },
    };
  }
}
