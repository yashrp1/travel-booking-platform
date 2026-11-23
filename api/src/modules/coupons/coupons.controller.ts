import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { VerifyCouponDto } from './dto/verify-coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Retrieve promotional coupon codes and offers' })
  @ApiQuery({ name: 'category', required: false, enum: ['HOTEL', 'CAB'] })
  getActiveCoupons(@Query('category') category?: string) {
    return this.couponsService.getActiveCoupons(category);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify promo coupon eligibility and calculate savings' })
  verifyCoupon(@Body() dto: VerifyCouponDto) {
    return this.couponsService.verifyCoupon(dto);
  }
}
