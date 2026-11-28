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

  private mapDbHotelToPropertyItem(h: any): PropertyItem {
    const rooms: PropertyRoom[] = (h.roomTypes || []).map((rt: any) => ({
      id: rt.id,
      name: rt.name,
      sqft: rt.areaSqft || 350,
      bed: rt.bedType || '1 King Bed',
      price: Number(rt.basePricePerNight) || 4500,
      inclusions: Array.isArray(rt.inclusions) ? rt.inclusions : ['Free High-Speed WiFi'],
      totalInventory: rt.totalInventory ?? 10,
      availableRooms: rt.availableRooms ?? 10,
    }));

    const pricePerNight = Number(h.pricePerNight) || (rooms[0] ? rooms[0].price : 4500);
    const originalPrice = Number(h.originalPrice) || Math.round(pricePerNight * 1.3);
    const taxesAndFees = Number(h.taxesAndFees) || Math.round(pricePerNight * 0.18);

    return {
      id: h.id,
      name: h.name,
      slug: h.slug,
      propertyType: (h.propertyType as any) || 'HOTEL',
      starRating: h.starRating || 4,
      userRating: h.userRating || 4.8,
      reviewCount: h.reviewCount || 0,
      city: h.city,
      area: h.area || h.city,
      address: h.address,
      distanceFromBeach: h.distanceFromBeach || 'Prime Location',
      thumbnailUrl: h.thumbnailUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: Array.isArray(h.images) && h.images.length > 0 ? h.images : [h.thumbnailUrl],
      pricePerNight,
      originalPrice,
      taxesAndFees,
      freeCancellation: h.freeCancellationAvailable ?? true,
      breakfastIncluded: h.breakfastAvailable ?? true,
      amenities: Array.isArray(h.amenities) ? h.amenities : ['WiFi', 'Air Conditioning', 'Room Service'],
      status: (h.status as any) || (h.isActive ? 'ACTIVE' : 'SUSPENDED'),
      partnerId: h.partnerId || undefined,
      partnerName: h.partnerName || undefined,
      createdAt: h.createdAt ? h.createdAt.toISOString() : new Date().toISOString(),
      rooms,
    };
  }

  async getDestinations(query = '') {
    try {
      const hotels = await this.prisma.hotel.findMany({
        where: { isActive: true },
        select: { city: true, state: true, propertyType: true },
      });

      const cityMap = new Map<string, { name: string; state: string; count: number; type: string }>();
      for (const h of hotels) {
        const cityKey = h.city.trim().toLowerCase();
        if (!cityMap.has(cityKey)) {
          cityMap.set(cityKey, {
            name: h.city.trim(),
            state: h.state || 'India',
            count: 1,
            type: h.propertyType === 'RESORT' ? 'HILL_STATION' : 'CITY',
          });
        } else {
          cityMap.get(cityKey)!.count += 1;
        }
      }

      const list = Array.from(cityMap.entries()).map(([key, val]) => ({
        id: `loc_${key.replace(/[^a-z0-9]/g, '_')}`,
        name: val.name,
        state: val.state,
        type: val.type,
        hotelCount: val.count,
      }));

      if (!query) return list;
      return list.filter((l) => l.name.toLowerCase().includes(query.toLowerCase()));
    } catch {
      return [];
    }
  }

  async searchDestinations(query = '') {
    return this.getDestinations(query);
  }

  async searchHotels(dto: HotelSearchDto) {
    try {
      const whereClause: any = {
        isActive: true,
        status: 'ACTIVE',
      };

      if (dto.destination) {
        whereClause.city = { contains: dto.destination, mode: 'insensitive' };
      }

      if (dto.starRatings && dto.starRatings.length > 0) {
        whereClause.starRating = { in: dto.starRatings };
      }

      if (dto.maxPrice) {
        whereClause.pricePerNight = { lte: dto.maxPrice };
      }

      const dbHotels = await this.prisma.hotel.findMany({
        where: whereClause,
        include: { roomTypes: true },
        orderBy: { createdAt: 'desc' },
      });

      const results = dbHotels.map((h) => this.mapDbHotelToPropertyItem(h));

      return {
        total: results.length,
        destination: dto.destination,
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        hotels: results,
      };
    } catch {
      return {
        total: 0,
        destination: dto.destination,
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        hotels: [],
      };
    }
  }

  async getHotelById(id: string): Promise<PropertyItem> {
    try {
      const h = await this.prisma.hotel.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: { roomTypes: true },
      });

      if (!h) {
        throw new NotFoundException(`Property with ID ${id} not found in database`);
      }

      return this.mapDbHotelToPropertyItem(h);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
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

    const roomsInput = payload.rooms && payload.rooms.length > 0 ? payload.rooms : [
      {
        id: `room_${randomSuffix}_std`,
        name: 'Standard Deluxe Room',
        sqft: 350,
        bed: '1 King Bed',
        price: Number(payload.pricePerNight) || Number((payload as any).basePrice) || 4500,
        inclusions: ['Free High-Speed WiFi', '24x7 Room Service', 'Complimentary Bottled Water'],
        totalInventory: 10,
        availableRooms: 10,
      },
    ];

    const pricePerNight =
      Number(payload.pricePerNight) ||
      Number((payload as any).discountedPrice) ||
      Number((payload as any).basePrice) ||
      (roomsInput[0] ? roomsInput[0].price : 4500);

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
      (payload.address ? payload.address.split(',')[0].trim() : payload.city || 'Central');

    const created = await this.prisma.hotel.create({
      data: {
        id,
        name: payload.name || 'Untitled Boutique Property',
        slug,
        propertyType: payload.propertyType || 'HOTEL',
        starRating: Number(payload.starRating) || 4,
        userRating: 4.8,
        reviewCount: 0,
        city: payload.city || 'Goa',
        state: payload.state || 'India',
        area: areaName,
        address: payload.address || `${areaName}, ${payload.city || 'India'}`,
        distanceFromBeach: payload.distanceFromBeach || 'Prime Location',
        thumbnailUrl: thumbUrl,
        images: payload.images || [thumbUrl],
        pricePerNight,
        originalPrice,
        taxesAndFees,
        freeCancellationAvailable: payload.freeCancellation ?? true,
        breakfastAvailable: payload.breakfastIncluded ?? true,
        amenities: payload.amenities || ['WiFi', 'Air Conditioning', 'Room Service'],
        status: 'PENDING_APPROVAL',
        isActive: false, // Requires SuperAdmin sign-off to appear on public guest search
        partnerId: payload.partnerId || 'partner_host',
        partnerName: payload.partnerName || 'Verified Partner Host',
        roomTypes: {
          create: roomsInput.map((r, i) => ({
            id: r.id || `room_${randomSuffix}_${i}`,
            name: r.name || 'Deluxe Room',
            areaSqft: Number(r.sqft) || 350,
            bedType: r.bed || '1 King Bed',
            basePricePerNight: Number(r.price) || pricePerNight,
            inclusions: r.inclusions || ['Free High-Speed WiFi'],
            totalInventory: Number(r.totalInventory) || 10,
            availableRooms: Number(r.availableRooms) || 10,
          })),
        },
      },
      include: { roomTypes: true },
    });

    return this.mapDbHotelToPropertyItem(created);
  }

  async getPartnerProperties(partnerId?: string) {
    try {
      const whereClause = partnerId ? { partnerId } : {};
      const hotels = await this.prisma.hotel.findMany({
        where: whereClause,
        include: { roomTypes: true },
        orderBy: { createdAt: 'desc' },
      });
      return hotels.map((h) => this.mapDbHotelToPropertyItem(h));
    } catch {
      return [];
    }
  }

  async updatePropertyRates(id: string, updateDto: { roomTypeId?: string; newPrice?: number; availableRooms?: number }) {
    if (updateDto.roomTypeId) {
      await this.prisma.roomType.update({
        where: { id: updateDto.roomTypeId },
        data: {
          ...(updateDto.newPrice && { basePricePerNight: Number(updateDto.newPrice) }),
          ...(updateDto.availableRooms !== undefined && { availableRooms: Number(updateDto.availableRooms) }),
        },
      });
    }

    if (updateDto.newPrice) {
      await this.prisma.hotel.update({
        where: { id },
        data: {
          pricePerNight: Number(updateDto.newPrice),
          taxesAndFees: Math.round(Number(updateDto.newPrice) * 0.18),
        },
      });
    }

    return this.getHotelById(id);
  }

  // --- SUPER ADMIN & PLATFORM AUDIT METHODS ---

  async getAllPropertiesForAdmin() {
    try {
      const hotels = await this.prisma.hotel.findMany({
        include: { roomTypes: true },
        orderBy: { createdAt: 'desc' },
      });
      return hotels.map((h) => this.mapDbHotelToPropertyItem(h));
    } catch {
      return [];
    }
  }

  async getPendingApprovals() {
    try {
      const hotels = await this.prisma.hotel.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: { roomTypes: true },
        orderBy: { createdAt: 'desc' },
      });
      return hotels.map((h) => this.mapDbHotelToPropertyItem(h));
    } catch {
      return [];
    }
  }

  async setApprovalDecision(id: string, decision: 'APPROVE' | 'REJECT', notes?: string) {
    const isApproved = decision === 'APPROVE';
    const updated = await this.prisma.hotel.update({
      where: { id },
      data: {
        status: isApproved ? 'ACTIVE' : 'REJECTED',
        isActive: isApproved,
      },
      include: { roomTypes: true },
    });
    return this.mapDbHotelToPropertyItem(updated);
  }

  async togglePropertyStatus(id: string) {
    const hotel = await this.getHotelById(id);
    const newStatus = hotel.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updated = await this.prisma.hotel.update({
      where: { id },
      data: {
        status: newStatus,
        isActive: newStatus === 'ACTIVE',
      },
      include: { roomTypes: true },
    });
    return this.mapDbHotelToPropertyItem(updated);
  }
}
