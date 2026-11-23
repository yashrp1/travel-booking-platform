import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HotelSearchDto } from './dto/hotel-search.dto';

export interface PropertyRoom {
  id: string;
  name: string;
  sqft: number;
  bed: string;
  price: number;
  inclusions: string[];
  totalInventory?: number;
  availableRooms?: number;
}

export interface PropertyItem {
  id: string;
  name: string;
  slug: string;
  propertyType: 'HOTEL' | 'RESORT' | 'HOMESTAY' | 'VILLA';
  starRating: number;
  userRating: number;
  reviewCount: number;
  city: string;
  area: string;
  address?: string;
  distanceFromBeach: string;
  thumbnailUrl: string;
  images?: string[];
  pricePerNight: number;
  originalPrice: number;
  taxesAndFees: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  amenities?: string[];
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED';
  partnerId?: string;
  partnerName?: string;
  rejectionReason?: string;
  createdAt: string;
  rooms: PropertyRoom[];
}

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  // Master In-Memory & Database-Synchronized Inventory
  private properties: PropertyItem[] = [
    {
      id: 'htl_taj_fort_aguada',
      name: 'Taj Fort Aguada Resort & Spa',
      slug: 'taj-fort-aguada-goa',
      propertyType: 'RESORT',
      starRating: 5,
      userRating: 4.8,
      reviewCount: 3240,
      city: 'Goa',
      area: 'Sinquerim, Candolim',
      address: 'Sinquerim Beach, Candolim, Goa 403515',
      distanceFromBeach: 'Direct Beachfront access',
      thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      pricePerNight: 14500,
      originalPrice: 19500,
      taxesAndFees: 2610,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_taj_group',
      partnerName: 'Taj Hospitality Group',
      createdAt: '2026-01-10T10:00:00.000Z',
      rooms: [
        {
          id: 'room_deluxe_sea',
          name: 'Deluxe Sea Facing Room',
          sqft: 420,
          bed: '1 King Bed',
          price: 14500,
          inclusions: ['Free Buffet Breakfast', 'High-Speed WiFi', 'Sunset Cruise Voucher'],
          totalInventory: 25,
          availableRooms: 12,
        },
        {
          id: 'room_villa_suite',
          name: 'Premium Heritage Villa Suite',
          sqft: 750,
          bed: '1 King Bed + Balcony',
          price: 24500,
          inclusions: ['Breakfast & Dinner', 'Private Butler Service', 'Airport Pick-up in Luxury Sedan'],
          totalInventory: 15,
          availableRooms: 4,
        },
      ],
    },
    {
      id: 'htl_rambagh_palace',
      name: 'Rambagh Palace - Royal Heritage',
      slug: 'rambagh-palace-jaipur',
      propertyType: 'HOTEL',
      starRating: 5,
      userRating: 4.9,
      reviewCount: 2890,
      city: 'Jaipur',
      area: 'Bhawani Singh Road',
      address: 'Bhawani Singh Rd, Jaipur, Rajasthan 302005',
      distanceFromBeach: '3.5 km from City Palace',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      pricePerNight: 32000,
      originalPrice: 42000,
      taxesAndFees: 5760,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_royal_stays',
      partnerName: 'Royal Heritage Escapes',
      createdAt: '2026-02-15T10:00:00.000Z',
      rooms: [
        {
          id: 'room_palace_courtyard',
          name: 'Palace Room with Courtyard View',
          sqft: 550,
          bed: '1 Grand King Bed',
          price: 32000,
          inclusions: ['Royal Breakfast Feast', 'Palace Historical Tour', 'Signature Spa Discount'],
          totalInventory: 20,
          availableRooms: 6,
        },
      ],
    },
    {
      id: 'htl_grand_hyatt_mumbai',
      name: 'Grand Hyatt Hotel & Residences',
      slug: 'grand-hyatt-mumbai',
      propertyType: 'HOTEL',
      starRating: 5,
      userRating: 4.6,
      reviewCount: 4120,
      city: 'Mumbai',
      area: 'Santacruz East / BKC',
      address: 'Bandra Kurla Complex Vicinity, Mumbai 400055',
      distanceFromBeach: '10 min from Domestic Airport',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      pricePerNight: 9800,
      originalPrice: 13500,
      taxesAndFees: 1764,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_hyatt_india',
      partnerName: 'Hyatt International India',
      createdAt: '2026-03-01T10:00:00.000Z',
      rooms: [
        {
          id: 'room_grand_king_club',
          name: 'Grand King Club Room',
          sqft: 440,
          bed: '1 King Bed',
          price: 9800,
          inclusions: ['Club Lounge Access', 'Complimentary Evening Cocktails', 'Free Wi-Fi'],
          totalInventory: 30,
          availableRooms: 18,
        },
      ],
    },
    {
      id: 'htl_coorg_coffee_homestay',
      name: 'Silver Brook Coffee Plantation Homestay',
      slug: 'silver-brook-homestay-coorg',
      propertyType: 'HOMESTAY',
      starRating: 4,
      userRating: 4.9,
      reviewCount: 680,
      city: 'Coorg',
      area: 'Madikeri Hills',
      address: 'Kadagadal Village, Madikeri, Coorg, Karnataka 571201',
      distanceFromBeach: 'Surrounded by organic coffee trees & mountain streams',
      thumbnailUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800',
      pricePerNight: 5500,
      originalPrice: 7500,
      taxesAndFees: 990,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_coorg_plantations',
      partnerName: 'Western Ghats Homestays Collective',
      createdAt: '2026-03-20T10:00:00.000Z',
      rooms: [
        {
          id: 'room_estate_cottage',
          name: 'Heritage Estate Cottage',
          sqft: 450,
          bed: '1 King Wooden Bed + Verandah',
          price: 5500,
          inclusions: ['Traditional Kodava Breakfast', 'Plantation Guided Walk', 'Bonfire by the Stream'],
          totalInventory: 6,
          availableRooms: 3,
        },
      ],
    },
    {
      id: 'htl_movenpick_jakarta',
      name: 'Mövenpick Hotel Jakarta',
      slug: 'movenpick-hotel-jakarta',
      propertyType: 'HOTEL',
      starRating: 5,
      userRating: 4.96,
      reviewCount: 217,
      city: 'Jakarta',
      area: 'Gambir',
      address: 'Jl. Medan Merdeka Barat No. 21, Gambir, Jakarta Pusat',
      distanceFromBeach: 'City Center Skyline View',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000',
      pricePerNight: 18500,
      originalPrice: 22000,
      taxesAndFees: 3330,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_accor_movenpick',
      partnerName: 'Accor Hotels Group',
      createdAt: '2026-03-25T10:00:00.000Z',
      rooms: [
        {
          id: 'room_movenpick_deluxe',
          name: 'Executive Skyline King Suite',
          sqft: 520,
          bed: '1 King Bed + Lounge Access',
          price: 18500,
          inclusions: ['Chocolate Hour Buffet', 'Club Lounge Access', 'High-Speed Wi-Fi'],
          totalInventory: 20,
          availableRooms: 8,
        },
      ],
    },
    {
      id: 'htl_oberoi_udaivilas',
      name: 'The Oberoi Udaivilas - Lake Pichola',
      slug: 'the-oberoi-udaivilas-udaipur',
      propertyType: 'RESORT',
      starRating: 5,
      userRating: 4.98,
      reviewCount: 1840,
      city: 'Udaipur',
      area: 'Haridas Ji Ki Magri',
      address: 'Badi-Gorela-Mulla Tala Rd, Haridas Ji Ki Magri, Udaipur 313001',
      distanceFromBeach: 'Direct Lake Pichola Frontage',
      thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000',
      pricePerNight: 42000,
      originalPrice: 55000,
      taxesAndFees: 7560,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_oberoi_group',
      partnerName: 'Oberoi Hotels & Resorts',
      createdAt: '2026-04-01T10:00:00.000Z',
      rooms: [
        {
          id: 'room_premier_lake_view',
          name: 'Premier Room with Semi-Private Pool',
          sqft: 600,
          bed: '1 Royal King Bed',
          price: 42000,
          inclusions: ['Royal Breakfast on Lakeside Terrace', 'Private Boat Arrival', 'Yoga Masterclass'],
          totalInventory: 18,
          availableRooms: 5,
        },
      ],
    },
    {
      id: 'htl_leela_palace_bengaluru',
      name: 'The Leela Palace - Royal Gardens',
      slug: 'the-leela-palace-bengaluru',
      propertyType: 'HOTEL',
      starRating: 5,
      userRating: 4.91,
      reviewCount: 3120,
      city: 'Bengaluru',
      area: 'HAL Old Airport Road',
      address: '23 HAL Old Airport Rd, Kodihalli, Bengaluru 560008',
      distanceFromBeach: 'Nestled amidst 7 acres of lush royal gardens',
      thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000',
      pricePerNight: 16500,
      originalPrice: 21000,
      taxesAndFees: 2970,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_leela_group',
      partnerName: 'The Leela Palaces, Hotels and Resorts',
      createdAt: '2026-04-05T10:00:00.000Z',
      rooms: [
        {
          id: 'room_royal_premier',
          name: 'Royal Premier Garden View Room',
          sqft: 550,
          bed: '1 King Bed + Balcony',
          price: 16500,
          inclusions: ['Grand Palace Breakfast', 'Butler Service', 'Spa Hydrotherapy Access'],
          totalInventory: 24,
          availableRooms: 11,
        },
      ],
    },
    {
      id: 'htl_wildflower_hall_manali',
      name: 'Wildflower Hall - Himalayan Luxury Retreat',
      slug: 'wildflower-hall-himachal',
      propertyType: 'RESORT',
      starRating: 5,
      userRating: 4.97,
      reviewCount: 1420,
      city: 'Manali',
      area: 'Chharabra Pine Ridge',
      address: 'Chharabra, Shimla-Kulu Highway, Himachal Pradesh 171012',
      distanceFromBeach: 'Panoramic snow-capped Himalayan mountain vistas',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000',
      pricePerNight: 28000,
      originalPrice: 35000,
      taxesAndFees: 5040,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_oberoi_group',
      partnerName: 'Oberoi Hotels & Resorts',
      createdAt: '2026-04-10T10:00:00.000Z',
      rooms: [
        {
          id: 'room_deluxe_mountain_view',
          name: 'Mountain View Cedar Pine Suite',
          sqft: 580,
          bed: '1 King Bed + Fireplace',
          price: 28000,
          inclusions: ['Heated Indoor Pool Access', 'Nature Trail Guide', 'Complimentary High Tea'],
          totalInventory: 15,
          availableRooms: 6,
        },
      ],
    },
    {
      id: 'htl_itc_maurya_delhi',
      name: 'ITC Maurya - The Luxury Collection',
      slug: 'itc-maurya-new-delhi',
      propertyType: 'HOTEL',
      starRating: 5,
      userRating: 4.88,
      reviewCount: 4210,
      city: 'New Delhi',
      area: 'Diplomatic Enclave, Chanakyapuri',
      address: 'Diplomatic Enclave, Sardar Patel Marg, New Delhi 110021',
      distanceFromBeach: '15 min from India Gate and Rashtrapati Bhavan',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000',
      pricePerNight: 19500,
      originalPrice: 25000,
      taxesAndFees: 3510,
      freeCancellation: true,
      breakfastIncluded: true,
      status: 'ACTIVE',
      partnerId: 'partner_itc_hotels',
      partnerName: 'ITC Hotels Luxury Collection',
      createdAt: '2026-04-12T10:00:00.000Z',
      rooms: [
        {
          id: 'room_executive_club',
          name: 'Executive Club Grand King Room',
          sqft: 480,
          bed: '1 King Bed',
          price: 19500,
          inclusions: ['Bukhara Dining Priority', 'Club Lounge Cocktails', 'High-Speed Wi-Fi'],
          totalInventory: 35,
          availableRooms: 14,
        },
      ],
    },
  ];

  async searchDestinations(query: string) {
    const list = [
      { id: 'loc_goa', name: 'Goa', state: 'Goa', type: 'CITY', hotelCount: 1420 },
      { id: 'loc_jaipur', name: 'Jaipur', state: 'Rajasthan', type: 'CITY', hotelCount: 740 },
      { id: 'loc_mumbai', name: 'Mumbai', state: 'Maharashtra', type: 'CITY', hotelCount: 980 },
      { id: 'loc_delhi', name: 'New Delhi', state: 'Delhi', type: 'CITY', hotelCount: 1850 },
      { id: 'loc_bengaluru', name: 'Bengaluru', state: 'Karnataka', type: 'CITY', hotelCount: 1120 },
      { id: 'loc_coorg', name: 'Coorg', state: 'Karnataka', type: 'HILL_STATION', hotelCount: 390 },
      { id: 'loc_udaipur', name: 'Udaipur', state: 'Rajasthan', type: 'CITY', hotelCount: 460 },
      { id: 'loc_manali', name: 'Manali', state: 'Himachal Pradesh', type: 'CITY', hotelCount: 620 },
    ];

    if (!query) return list;
    return list.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));
  }

  async searchHotels(dto: HotelSearchDto) {
    // Only return ACTIVE properties to customers
    let results = this.properties.filter((h) => h.status === 'ACTIVE');

    if (dto.destination) {
      const filteredByCity = results.filter((h) =>
        h.city.toLowerCase().includes(dto.destination.toLowerCase())
      );
      if (filteredByCity.length > 0) {
        results = filteredByCity;
      }
    }

    if (dto.starRatings && dto.starRatings.length > 0) {
      results = results.filter((h) => dto.starRatings.includes(h.starRating));
    }

    if (dto.maxPrice) {
      results = results.filter((h) => h.pricePerNight <= dto.maxPrice);
    }

    return {
      total: results.length,
      destination: dto.destination,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      hotels: results,
    };
  }

  async getHotelById(id: string) {
    const hotel = this.properties.find((h) => h.id === id);
    if (!hotel) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return hotel;
  }

  async getRooms(hotelId: string) {
    const hotel = await this.getHotelById(hotelId);
    return hotel.rooms;
  }

  // --- PARTNER & HOST METHODS ---

  async createPartnerProperty(payload: Partial<PropertyItem> & Record<string, any>) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `htl_${(payload.name || 'property').toLowerCase().replace(/[^a-z0-9]/g, '_')}_${randomSuffix}`;
    const slug = `${(payload.name || 'property').toLowerCase().replace(/[^a-z0-9]/g, '-')}-${(payload.city || 'india').toLowerCase()}-${randomSuffix}`;

    const rooms: PropertyRoom[] = payload.rooms && payload.rooms.length > 0 ? payload.rooms.map((r, i) => ({
      id: r.id || `room_${randomSuffix}_${i}`,
      name: r.name || 'Deluxe Room',
      sqft: Number(r.sqft) || 350,
      bed: r.bed || '1 King Bed',
      price: Number(r.price) || Number(payload.pricePerNight) || 4500,
      inclusions: r.inclusions || ['Free High-Speed WiFi', '24x7 Hot Water'],
      totalInventory: Number(r.totalInventory) || 10,
      availableRooms: Number(r.availableRooms) || 10,
    })) : [
      {
        id: `room_${randomSuffix}_std`,
        name: 'Standard Room',
        sqft: 320,
        bed: '1 King Bed',
        price: Number(payload.pricePerNight) || 4500,
        inclusions: ['Free High-Speed WiFi', 'Complimentary Bottled Water'],
        totalInventory: 10,
        availableRooms: 10,
      },
    ];

    const pricePerNight =
      Number(payload.pricePerNight) ||
      Number((payload as any).discountedPrice) ||
      Number((payload as any).basePrice) ||
      (rooms[0] ? rooms[0].price : 4500);

    const originalPrice =
      Number(payload.originalPrice) ||
      Number((payload as any).basePrice) ||
      Math.round(pricePerNight * 1.3);

    const taxesAndFees = Math.round(pricePerNight * 0.18);
    const thumbUrl =
      payload.thumbnailUrl ||
      (payload as any).imageUrl ||
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

    const areaName =
      payload.area ||
      (payload.address ? payload.address.split(',')[0].trim() : 'Central');

    const newProperty: PropertyItem = {
      id,
      name: payload.name || 'Untitled Boutique Property',
      slug,
      propertyType: payload.propertyType || 'HOTEL',
      starRating: Number(payload.starRating) || 4,
      userRating: 4.8,
      reviewCount: 1,
      city: payload.city || 'Goa',
      area: areaName,
      address: payload.address || `${areaName}, ${payload.city || 'India'}`,
      distanceFromBeach: payload.distanceFromBeach || 'Prime Location',
      thumbnailUrl: thumbUrl,
      images: payload.images || [thumbUrl],
      pricePerNight,
      originalPrice,
      taxesAndFees,
      freeCancellation: payload.freeCancellation ?? true,
      breakfastIncluded: payload.breakfastIncluded ?? true,
      amenities: payload.amenities || ['WiFi', 'Air Conditioning', 'Room Service'],
      status: 'PENDING_APPROVAL', // Requires SuperAdmin sign-off to appear on main search
      partnerId: payload.partnerId || 'partner_demo_vendor',
      partnerName: payload.partnerName || 'Verified Partner Host',
      createdAt: new Date().toISOString(),
      rooms,
    };

    this.properties.unshift(newProperty);
    return newProperty;
  }

  async getPartnerProperties(partnerId?: string) {
    if (partnerId) {
      return this.properties.filter((p) => p.partnerId === partnerId);
    }
    return this.properties;
  }

  async updatePropertyRates(id: string, updateDto: { roomTypeId?: string; newPrice?: number; availableRooms?: number }) {
    const property = await this.getHotelById(id);

    if (updateDto.roomTypeId) {
      const room = property.rooms.find((r) => r.id === updateDto.roomTypeId);
      if (room) {
        if (updateDto.newPrice) room.price = Number(updateDto.newPrice);
        if (updateDto.availableRooms !== undefined) room.availableRooms = Number(updateDto.availableRooms);
      }
    }

    if (updateDto.newPrice) {
      property.pricePerNight = Number(updateDto.newPrice);
      property.taxesAndFees = Math.round(property.pricePerNight * 0.18);
    }

    return property;
  }

  // --- SUPER ADMIN & PLATFORM AUDIT METHODS ---

  async getAllPropertiesForAdmin() {
    return this.properties;
  }

  async getPendingApprovals() {
    return this.properties.filter((p) => p.status === 'PENDING_APPROVAL');
  }

  async setApprovalDecision(id: string, decision: 'APPROVE' | 'REJECT', notes?: string) {
    const property = await this.getHotelById(id);
    if (decision === 'APPROVE') {
      property.status = 'ACTIVE';
    } else {
      property.status = 'REJECTED';
      property.rejectionReason = notes || 'Does not meet minimum platform compliance specifications.';
    }
    return property;
  }

  async togglePropertyStatus(id: string) {
    const property = await this.getHotelById(id);
    property.status = property.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    return property;
  }
}

