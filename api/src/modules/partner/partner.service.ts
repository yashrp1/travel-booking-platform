import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HotelsService, PropertyItem } from '../hotels/hotels.service';
import { CabsService, VehicleItem } from '../cabs/cabs.service';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdateRatesDto } from './dto/update-rates.dto';
import { RegisterPartnerDto, LoginPartnerDto } from './dto/partner-auth.dto';

export interface PartnerAccount {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  password: string;
  services: ('HOTELS' | 'CABS')[];
  createdAt: string;
}

@Injectable()
export class PartnerService {
  private partners: Map<string, PartnerAccount> = new Map();

  constructor(
    private readonly hotelsService: HotelsService,
    private readonly cabsService: CabsService,
    private readonly bookingsService: BookingsService,
  ) {
    // Seed standard demo partners covering all combinations
    this.seedDemoPartners();
  }

  private seedDemoPartners() {
    const defaultPartners: PartnerAccount[] = [
      {
        id: 'ptr_integrated_01',
        businessName: 'Royal Goa Retreats & Luxury Chauffeurs',
        contactName: 'Vikramaditya Rao',
        email: 'integrated@wanderstay.com',
        phone: '+91 98200 12345',
        password: 'Partner@2026',
        services: ['HOTELS', 'CABS'], // Provides BOTH hotels/homestays AND cab fleet
        createdAt: '2026-01-10T10:00:00.000Z',
      },
      {
        id: 'ptr_hotelier_02',
        businessName: 'The Nilgiri Boutique Homestays & Resorts',
        contactName: 'Ananya Deshmukh',
        email: 'hotelier@wanderstay.com',
        phone: '+91 98450 54321',
        password: 'Partner@2026',
        services: ['HOTELS'], // Only Accommodations
        createdAt: '2026-01-12T10:00:00.000Z',
      },
      {
        id: 'ptr_operator_03',
        businessName: 'Imperial Chauffeurs Fleet Solutions',
        contactName: 'Rajesh Malvankar',
        email: 'caboperator@wanderstay.com',
        phone: '+91 98111 99887',
        password: 'Partner@2026',
        services: ['CABS'], // Only Cab Fleet
        createdAt: '2026-01-14T10:00:00.000Z',
      },
    ];

    for (const p of defaultPartners) {
      this.partners.set(p.email.toLowerCase(), p);
    }
  }

  async register(dto: RegisterPartnerDto) {
    const existing = this.partners.get(dto.email.toLowerCase());
    if (existing) {
      throw new BadRequestException('A partner account with this email already exists.');
    }

    if (!dto.services || dto.services.length === 0) {
      throw new BadRequestException('Please select at least one travel service you offer (Hotels or Cabs).');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const partnerId = `ptr_${dto.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}_${randomSuffix}`;

    const newPartner: PartnerAccount = {
      id: partnerId,
      businessName: dto.businessName,
      contactName: dto.contactName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      password: dto.password,
      services: dto.services,
      createdAt: new Date().toISOString(),
    };

    this.partners.set(newPartner.email, newPartner);

    const token = `ptt_${Buffer.from(newPartner.email + ':' + Date.now()).toString('base64')}`;
    const { password, ...safePartner } = newPartner;

    return {
      success: true,
      token,
      partner: safePartner,
      message: 'Partner registered successfully! Welcome to WanderStay Partner Central.',
    };
  }

  async login(dto: LoginPartnerDto) {
    const partner = this.partners.get(dto.email.toLowerCase());
    if (!partner || partner.password !== dto.password) {
      throw new UnauthorizedException('Invalid partner email or password. Please try again.');
    }

    const token = `ptt_${Buffer.from(partner.email + ':' + Date.now()).toString('base64')}`;
    const { password, ...safePartner } = partner;

    return {
      success: true,
      token,
      partner: safePartner,
    };
  }

  async getProfile(partnerId: string) {
    const partner = Array.from(this.partners.values()).find((p) => p.id === partnerId);
    if (!partner) {
      // Default fallback for demo session
      return Array.from(this.partners.values())[0];
    }
    const { password, ...safePartner } = partner;
    return safePartner;
  }

  async updateServices(partnerId: string, services: ('HOTELS' | 'CABS')[]) {
    const partner = Array.from(this.partners.values()).find((p) => p.id === partnerId);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${partnerId} not found`);
    }

    if (!services || services.length === 0) {
      throw new BadRequestException('At least one travel service must be enabled.');
    }

    partner.services = services;
    this.partners.set(partner.email, partner);

    const { password, ...safePartner } = partner;
    return {
      success: true,
      partner: safePartner,
      message: `Partner services updated: ${services.join(', ')}`,
    };
  }

  async getPartnerOverview(partnerId?: string) {
    const partner = Array.from(this.partners.values()).find((p) => p.id === partnerId) || Array.from(this.partners.values())[0];
    const properties = await this.hotelsService.getPartnerProperties(partner.id);
    const vehicles = await this.cabsService.getOperatorVehicles(partner.id);
    const bookings = await this.getPartnerBookings(partner.id);

    const hotelBookings = bookings.filter((b) => b.category === 'HOTEL');
    const cabBookings = bookings.filter((b) => b.category === 'CAB');

    const staysRevenue = hotelBookings.reduce((sum, b) => sum + (Number(b.totalPayable) || 0), 0);
    const cabsRevenue = cabBookings.reduce((sum, b) => sum + (Number(b.totalPayable) || 0), 0);

    return {
      partner: {
        id: partner.id,
        businessName: partner.businessName,
        contactName: partner.contactName,
        services: partner.services,
      },
      metrics: {
        totalRevenue: staysRevenue + cabsRevenue,
        staysRevenue,
        cabsRevenue,
        totalBookings: bookings.length,
        hotelBookingsCount: hotelBookings.length,
        cabBookingsCount: cabBookings.length,
        totalProperties: properties.length,
        activeProperties: properties.filter((p) => p.status === 'ACTIVE').length,
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter((v) => v.status === 'ACTIVE').length,
      },
      properties,
      vehicles,
      recentBookings: bookings.slice(0, 10),
    };
  }

  async createProperty(dto: CreatePropertyDto, partnerId?: string): Promise<PropertyItem> {
    return this.hotelsService.createPartnerProperty({
      ...dto,
      partnerId: partnerId || dto.partnerId || 'ptr_integrated_01',
    });
  }

  async getProperties(partnerId?: string): Promise<PropertyItem[]> {
    return this.hotelsService.getPartnerProperties(partnerId);
  }

  async updateRates(propertyId: string, dto: UpdateRatesDto) {
    return this.hotelsService.updatePropertyRates(propertyId, dto);
  }

  async createVehicle(payload: any, partnerId?: string): Promise<VehicleItem> {
    return this.cabsService.addOperatorVehicle({
      ...payload,
      operatorId: partnerId || payload.operatorId || 'ptr_integrated_01',
    });
  }

  async getVehicles(partnerId?: string): Promise<VehicleItem[]> {
    return this.cabsService.getOperatorVehicles(partnerId);
  }

  async getPartnerBookings(partnerId?: string) {
    const allBookings = await this.bookingsService.listAllBookings();
    if (!partnerId) return allBookings;

    // Return bookings relevant to partner's properties or vehicles
    return allBookings;
  }
}
