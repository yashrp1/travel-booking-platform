import { Injectable, BadRequestException } from '@nestjs/common';
import { VerifyCouponDto } from './dto/verify-coupon.dto';

export interface CouponItem {
  code: string;
  category: 'HOTEL' | 'CAB' | 'ALL';
  discountType: 'FLAT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
}

@Injectable()
export class CouponsService {
  private readonly coupons: CouponItem[] = [];

  createCoupon(dto: CouponItem) {
    this.coupons.unshift(dto);
    return dto;
  }

  getActiveCoupons(category?: string) {
    if (!category) return this.coupons;
    return this.coupons.filter(
      (c) => c.category === 'ALL' || c.category === category.toUpperCase()
    );
  }

  verifyCoupon(dto: VerifyCouponDto) {
    const coupon = this.coupons.find(
      (c) => c.code.toUpperCase() === dto.code.trim().toUpperCase()
    );

    if (!coupon) {
      throw new BadRequestException(`Promo code "${dto.code}" is invalid or expired.`);
    }

    if (coupon.category !== 'ALL' && coupon.category !== dto.category.toUpperCase()) {
      throw new BadRequestException(
        `Coupon ${coupon.code} is only valid on ${coupon.category} reservations.`
      );
    }

    if (dto.orderAmount < coupon.minOrderValue) {
      throw new BadRequestException(
        `Minimum booking amount of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required to avail this offer.`
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'FLAT') {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = Math.round((dto.orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    const finalPayable = Math.max(0, dto.orderAmount - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      discountAmount,
      finalPayable,
      message: `Coupon "${coupon.code}" successfully applied! You saved ₹${discountAmount.toLocaleString('en-IN')}.`,
    };
  }
}
