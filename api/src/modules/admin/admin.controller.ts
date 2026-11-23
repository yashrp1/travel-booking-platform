import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { ApprovalDecisionDto } from './dto/approval-decision.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  async login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto);
  }

  @Get('overview')
  async getOverview() {
    const overview = await this.adminService.getOverview();
    return {
      success: true,
      data: overview,
    };
  }

  @Get('approvals/pending')
  async getPendingApprovals() {
    const approvals = await this.adminService.getPendingApprovals();
    return {
      success: true,
      data: approvals,
    };
  }

  @Post('approvals/decision')
  async processApprovalDecision(@Body() dto: ApprovalDecisionDto) {
    return this.adminService.processApprovalDecision(dto);
  }

  @Get('properties')
  async getAllProperties() {
    const properties = await this.adminService.getAllProperties();
    return {
      success: true,
      data: properties,
      count: properties.length,
    };
  }

  @Post('properties/:id/toggle')
  async togglePropertyStatus(@Param('id') id: string) {
    const property = await this.adminService.togglePropertyStatus(id);
    return {
      success: true,
      data: property,
      message: `Property status updated to ${property.status}`,
    };
  }

  @Get('vehicles')
  async getAllVehicles() {
    const vehicles = await this.adminService.getAllVehicles();
    return {
      success: true,
      data: vehicles,
      count: vehicles.length,
    };
  }

  @Post('vehicles/:id/toggle')
  async toggleVehicleStatus(@Param('id') id: string) {
    const vehicle = await this.adminService.toggleVehicleStatus(id);
    return {
      success: true,
      data: vehicle,
      message: `Vehicle status updated to ${vehicle.status}`,
    };
  }

  // --- BUS SERVICES MANAGEMENT ---
  @Get('buses')
  async getAllBuses() {
    const buses = await this.adminService.getAllBuses();
    return {
      success: true,
      data: buses,
      count: buses.length,
    };
  }

  @Post('buses')
  async createBus(@Body() dto: any) {
    const bus = await this.adminService.createBus(dto);
    return {
      success: true,
      data: bus,
      message: `New bus route "${bus.operatorName} (${bus.fromCity} ➔ ${bus.toCity})" added successfully!`,
    };
  }

  @Post('buses/:id/toggle')
  async toggleBusStatus(@Param('id') id: string) {
    const bus = await this.adminService.toggleBusStatus(id);
    return {
      success: true,
      data: bus,
      message: `Bus service status updated to ${bus.status}`,
    };
  }

  @Delete('buses/:id')
  async deleteBus(@Param('id') id: string) {
    const removed = await this.adminService.deleteBus(id);
    return {
      success: true,
      data: removed,
      message: `Bus route "${removed.operatorName}" has been removed.`,
    };
  }

  @Get('bookings')
  async getAllBookings() {
    const bookings = await this.adminService.getAllBookings();
    return {
      success: true,
      data: bookings,
      count: bookings.length,
    };
  }

  @Get('coupons')
  async getAllCoupons() {
    const coupons = await this.adminService.getAllCoupons();
    return {
      success: true,
      data: coupons,
      count: coupons.length,
    };
  }

  @Post('coupons')
  async createCoupon(@Body() dto: any) {
    const coupon = await this.adminService.createCoupon(dto);
    return {
      success: true,
      data: coupon,
      message: `Promotional coupon "${coupon.code}" created successfully.`,
    };
  }
}
