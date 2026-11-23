import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WanderStay Database Seeding...');

  // 1. Seed Coupons
  console.log('Seeding coupons...');
  const coupons = [
    {
      code: 'MMTWELCOME',
      discountType: 'FLAT',
      discountValue: 2000,
      minOrderAmount: 5000,
      maxDiscountAmount: 2000,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimitPerUser: 1,
      totalUsageLimit: 10000,
      isActive: true,
      description: 'Flat ₹2,000 OFF on your first premium hotel stay reservation.',
    },
    {
      code: 'SUPERSTAY',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderAmount: 8000,
      maxDiscountAmount: 3500,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimitPerUser: 3,
      totalUsageLimit: 50000,
      isActive: true,
      description: '15% instant savings up to ₹3,500 on luxury villas & 5-star resorts.',
    },
    {
      code: 'CABRUSH',
      discountType: 'FLAT',
      discountValue: 300,
      minOrderAmount: 1500,
      maxDiscountAmount: 300,
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-12-31'),
      usageLimitPerUser: 5,
      totalUsageLimit: 25000,
      isActive: true,
      description: 'Flat ₹300 OFF on outstation one-way and round-trip highway journeys.',
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon as any,
    });
  }

  // 2. Seed Hotels
  console.log('Seeding hotels and room inventory...');
  const tajHotel = await prisma.hotel.upsert({
    where: { slug: 'taj-fort-aguada-resort-spa-goa' },
    update: {},
    create: {
      name: 'Taj Fort Aguada Resort & Spa',
      slug: 'taj-fort-aguada-resort-spa-goa',
      starRating: 5,
      userRating: 4.8,
      reviewCount: 3420,
      propertyType: 'RESORT',
      city: 'Goa',
      state: 'Goa',
      address: 'Sinquerim, Candolim, Goa 403515',
      latitude: 15.4925,
      longitude: 73.7738,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&auto=format&fit=crop&q=80',
      ],
      rules: [
        'Valid Government Photo ID required at check-in (Aadhaar / Passport / DL).',
        'Check-in is from 2:00 PM; check-out is by 11:00 AM.',
        'Pets are not permitted on property grounds.',
      ],
      freeCancellationAvailable: true,
      breakfastAvailable: true,
    },
  });

  // Seed Room Type
  const roomType = await prisma.roomType.create({
    data: {
      hotelId: tajHotel.id,
      name: 'Deluxe Sea Facing Room with Balcony',
      description: 'Expansive oceanfront suite with private sit-out verandah overlooking the Arabian Sea.',
      maxAdults: 3,
      maxChildren: 1,
      maxOccupancy: 3,
      totalRooms: 20,
      bedType: 'King Size Bed',
      roomSizeSqFt: 450,
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      ],
      amenities: ['Sea View', 'Balcony', 'Free WiFi', 'Mini Bar', 'Bathtub', 'Air Conditioning'],
    },
  });

  // Seed Rate Plan
  await prisma.roomRatePlan.create({
    data: {
      roomTypeId: roomType.id,
      name: 'Continental Plan (CP) – Room & Breakfast',
      mealPlanCode: 'CP',
      basePrice: 14500,
      currency: 'INR',
      inclusions: [
        'Buffet breakfast at sea-facing coffee shop',
        'Complimentary High-speed WiFi',
        'Early check-in subject to availability',
      ],
      cancellationPolicyType: 'FREE_CANCELLATION',
      freeCancellationDeadlineHours: 48,
    },
  });

  // 3. Seed Cab Categories
  console.log('Seeding cab fleet categories...');
  const categories = [
    {
      code: 'hatchback',
      name: 'Hatchback',
      description: 'Budget-friendly rides for small families and solo travellers.',
      seatCapacity: 4,
      luggageCapacity: 2,
      modelExamples: 'WagonR, Swift, Tiago or similar',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: 'sedan',
      name: 'Sedan',
      description: 'Comfortable family cruising with spacious boot for outstation luggage.',
      seatCapacity: 4,
      luggageCapacity: 3,
      modelExamples: 'Dzire, Etios, Aura or similar',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: 'suv',
      name: 'SUV',
      description: 'Rugged high-clearance SUV for mountainous trips and extra gear.',
      seatCapacity: 6,
      luggageCapacity: 4,
      modelExamples: 'Ertiga, Carens, Triber or similar',
      thumbnailUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
    },
    {
      code: 'crysta',
      name: 'Premium SUV (Innova Crysta)',
      description: 'Top-tier luxury highway captain seats with unmatched ride comfort.',
      seatCapacity: 7,
      luggageCapacity: 5,
      modelExamples: 'Toyota Innova Crysta or Hycross',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    },
  ];

  for (const cat of categories) {
    await prisma.cabCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }

  console.log('✅ WanderStay Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
