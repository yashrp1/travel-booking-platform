import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { HotelsService } from '../hotels/hotels.service';
import { CabsService } from '../cabs/cabs.service';
import { BusesService } from '../buses/buses.service';
import { BookingsService } from '../bookings/bookings.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class AdminService {
  private readonly superAdminAccount = {
    id: 'usr_super_admin_01',
    email: 'admin@wanderstay.com',
    password: 'SuperAdmin@2026',
    name: 'Chief Operations Officer',
    role: 'SUPER_ADMIN',
    permissions: [
      'MANAGE_PROPERTIES',
      'MANAGE_FLEET',
      'MANAGE_BUSES',
      'APPROVE_SUPPLIERS',
      'FINANCIAL_OVERVIEW',
      'TOGGLE_INVENTORY',
      'CANCEL_BOOKINGS',
    ],
  };

  constructor(
    private readonly hotelsService: HotelsService,
    private readonly cabsService: CabsService,
    private readonly busesService: BusesService,
    private readonly bookingsService: BookingsService,
    private readonly couponsService: CouponsService,
  ) {}

  async login(dto: AdminLoginDto) {
    const isMasterEmail =
      dto.email.toLowerCase() === this.superAdminAccount.email.toLowerCase() ||
      dto.email.toLowerCase() === 'superadmin@wanderstay.com';

    if (!isMasterEmail || dto.password !== this.superAdminAccount.password) {
      throw new UnauthorizedException('Invalid Super Admin credentials. Please check your credentials.');
    }

    const sessionToken = `sat_${Buffer.from(dto.email + ':' + Date.now()).toString('base64')}`;

    return {
      success: true,
      token: sessionToken,
      user: {
        id: this.superAdminAccount.id,
        email: dto.email,
        name: this.superAdminAccount.name,
        role: this.superAdminAccount.role,
        permissions: this.superAdminAccount.permissions,
      },
    };
  }

  async getOverview() {
    const properties = await this.hotelsService.getAllPropertiesForAdmin();
    const vehicles = await this.cabsService.getAllVehiclesForAdmin();
    const buses = await this.busesService.getAllBuses();
    const bookings = await this.bookingsService.listAllBookings();

    const activeHotels = properties.filter((p: any) => p.status === 'ACTIVE').length;
    const activeCabs = vehicles.filter((v: any) => v.status === 'ACTIVE').length;
    const activeBuses = buses.filter((b: any) => b.status === 'ACTIVE').length;

    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.totalPayable || b.baseAmount || 0), 0);

    return {
      activeHotels,
      activeCabs,
      activeBuses,
      totalBookings: bookings.length,
      grossVolumeInr: totalRevenue,
      commissionEarnedInr: Math.round(totalRevenue * 0.12),
      growthRateMonthOverMonth: '+24.5%',
    };
  }

  async getPendingApprovals() {
    const properties = await this.hotelsService.getPendingApprovals();
    const vehicles = await this.cabsService.getPendingVehicles();

    return {
      properties,
      vehicles,
      totalPending: properties.length + vehicles.length,
    };
  }

  async processApprovalDecision(dto: ApprovalDecisionDto) {
    if (dto.type === 'PROPERTY') {
      const property = await this.hotelsService.setApprovalDecision(dto.id, dto.decision, dto.notes);
      return {
        success: true,
        data: property,
        message: `Property ${property.name} has been ${dto.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'}.`,
      };
    } else {
      const vehicle = await this.cabsService.setVehicleApproval(dto.id, dto.decision, dto.notes);
      return {
        success: true,
        data: vehicle,
        message: `Vehicle ${vehicle.name} has been ${dto.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'}.`,
      };
    }
  }

  async getAllProperties() {
    return this.hotelsService.getAllPropertiesForAdmin();
  }

  async togglePropertyStatus(id: string) {
    return this.hotelsService.togglePropertyStatus(id);
  }

  async getAllVehicles() {
    return this.cabsService.getAllVehiclesForAdmin();
  }

  async toggleVehicleStatus(id: string) {
    return this.cabsService.toggleVehicleStatus(id);
  }

  async getAllBuses() {
    return this.busesService.getAllBuses();
  }

  async createBus(dto: any) {
    return this.busesService.createBus(dto);
  }

  async toggleBusStatus(id: string) {
    return this.busesService.toggleBusStatus(id);
  }

  async deleteBus(id: string) {
    return this.busesService.deleteBus(id);
  }

  async getAllBookings() {
    return this.bookingsService.listAllBookings();
  }

  async getAllCoupons() {
    return this.couponsService.getActiveCoupons();
  }

  async createCoupon(dto: any) {
    return this.couponsService.createCoupon(dto);
  }
}
