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
  private readonly coupons: CouponItem[] = [
    {
      code: 'ESCAPE15',
      category: 'HOTEL',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 2000,
      maxDiscount: 4000,
      description: '15% instant savings on your premium stay.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'WANDER100',
      category: 'HOTEL',
      discountType: 'FLAT',
      discountValue: 100,
      minOrderValue: 500,
      description: 'Flat $100 / ₹100 instant welcome savings.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'MMTWELCOME',
      category: 'HOTEL',
      discountType: 'FLAT',
      discountValue: 2000,
      minOrderValue: 5000,
      description: 'Flat ₹2,000 OFF on your first premium hotel stay reservation.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'SUPERSTAY',
      category: 'HOTEL',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 8000,
      maxDiscount: 3500,
      description: '15% instant savings up to ₹3,500 on luxury villas & 5-star resorts.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'LUXURY2000',
      category: 'HOTEL',
      discountType: 'FLAT',
      discountValue: 2000,
      minOrderValue: 8000,
      description: 'Exclusive ₹2,000 savings on luxury 5-star suites & oceanfront resorts.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'WEEKENDSTAY',
      category: 'HOTEL',
      discountType: 'FLAT',
      discountValue: 1200,
      minOrderValue: 5000,
      description: 'Special ₹1,200 discount for weekend staycation getaways.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'BOUTIQUE10',
      category: 'HOTEL',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 4000,
      maxDiscount: 2500,
      description: '10% instant off on boutique heritage homestays & private estates.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'CABRUSH',
      category: 'CAB',
      discountType: 'FLAT',
      discountValue: 350,
      minOrderValue: 1500,
      description: 'Flat ₹350 OFF on outstation one-way and round-trip highway journeys.',
      expiryDate: '2026-12-31',
    },
    {
      code: 'AIRPORTFAST',
      category: 'CAB',
      discountType: 'FLAT',
      discountValue: 200,
      minOrderValue: 800,
      description: '₹200 instant discount on prompt airport pickup and drop rides.',
      expiryDate: '2026-12-31',
    },
  ];

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
