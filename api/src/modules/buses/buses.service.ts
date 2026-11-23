import { Injectable, NotFoundException } from '@nestjs/common';
import { BusSearchDto, CreateBusDto } from './dto/bus.dto';

export interface BusItem {
  id: string;
  operatorName: string;
  busType: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fare: number;
  originalFare: number;
  rating: number;
  reviewCount: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  registrationNumber?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  seats?: {
    id: string;
    number: string;
    deck: 'LOWER' | 'UPPER';
    type: 'SLEEPER' | 'SEATER';
    isBooked: boolean;
    fare: number;
  }[];
}

@Injectable()
export class BusesService {
  private buses: BusItem[] = [
    {
      id: 'bus_zing_del_manali',
      operatorName: 'Zingbus Plus Electric & Luxury',
      busType: 'BharatBenz AC Sleeper (2+1)',
      fromCity: 'New Delhi',
      toCity: 'Manali',
      departureTime: '08:30 PM',
      arrivalTime: '07:30 AM',
      duration: '11h 00m',
      fare: 1250,
      originalFare: 1650,
      rating: 4.8,
      reviewCount: 1420,
      totalSeats: 36,
      availableSeats: 16,
      amenities: ['Live Tracking', 'Clean Blanket', 'Charging Point', 'Free WiFi', 'Water Bottle', 'Emergency Exit'],
      boardingPoints: ['Kashmere Gate ISBT (Gate 1)', 'Majnu Ka Tilla', 'Murthal Dhabas'],
      droppingPoints: ['Private Bus Stand Manali', 'Mall Road Tourist Point'],
      registrationNumber: 'DL 01 AB 8812',
      status: 'ACTIVE',
      createdAt: '2026-01-10T10:00:00.000Z',
    },
    {
      id: 'bus_intrcity_del_manali',
      operatorName: 'IntrCity SmartBus Premium',
      busType: 'Volvo 9600 Multi-Axle AC Sleeper',
      fromCity: 'New Delhi',
      toCity: 'Manali',
      departureTime: '09:15 PM',
      arrivalTime: '08:00 AM',
      duration: '10h 45m',
      fare: 1490,
      originalFare: 1990,
      rating: 4.9,
      reviewCount: 2840,
      totalSeats: 36,
      availableSeats: 12,
      amenities: ['Smart Bus Lounge Access', 'Live GPS', 'Washroom Onboard', 'Blanket & Pillow', 'Reading Light'],
      boardingPoints: ['RK Ashram Marg Metro', 'Kashmere Gate Metro Gate 5', 'Karnal Toll'],
      droppingPoints: ['Govt Bus Stand Manali', 'Aleo Bridge'],
      registrationNumber: 'HP 65 B 4021',
      status: 'ACTIVE',
      createdAt: '2026-01-15T12:00:00.000Z',
    },
    {
      id: 'bus_vrl_mum_goa',
      operatorName: 'VRL Travels Executive',
      busType: 'Irizar i6 AC Luxury Sleeper (2+1)',
      fromCity: 'Mumbai',
      toCity: 'Goa',
      departureTime: '07:00 PM',
      arrivalTime: '07:30 AM',
      duration: '12h 30m',
      fare: 1100,
      originalFare: 1450,
      rating: 4.7,
      reviewCount: 3120,
      totalSeats: 36,
      availableSeats: 19,
      amenities: ['CCTV Surveillance', 'Personal LED TV', 'Charging Socket', 'Fresh Linen', 'Emergency Hammer'],
      boardingPoints: ['Borivali West (Gokul Hotel)', 'Andheri East (Pumps)', 'Vashi Plaza', 'Pune Expressway'],
      droppingPoints: ['Mapusa Private Bus Stand', 'Panjim KTC Bus Stand', 'Madgaon Railway Station'],
      registrationNumber: 'MH 04 GP 5540',
      status: 'ACTIVE',
      createdAt: '2026-01-20T08:00:00.000Z',
    },
    {
      id: 'bus_paul_del_jaipur',
      operatorName: 'RSY Royal Safari Express',
      busType: 'Volvo B11R AC Semi-Sleeper (2+2)',
      fromCity: 'New Delhi',
      toCity: 'Jaipur',
      departureTime: '06:00 AM',
      arrivalTime: '11:00 AM',
      duration: '05h 00m',
      fare: 550,
      originalFare: 750,
      rating: 4.6,
      reviewCount: 1890,
      totalSeats: 44,
      availableSeats: 26,
      amenities: ['Express Highway Route', 'Air Suspension', 'Free Snack Box', 'Charging Point'],
      boardingPoints: ['Dhaula Kuan Metro', 'IFFCO Chowk Gurgaon', 'Hero Honda Chowk'],
      droppingPoints: ['Sindhi Camp Jaipur', 'Narayan Singh Circle', 'Transport Nagar'],
      registrationNumber: 'RJ 14 PA 2311',
      status: 'ACTIVE',
      createdAt: '2026-02-01T10:00:00.000Z',
    },
    {
      id: 'bus_ksrtc_blr_coorg',
      operatorName: 'KSRTC Flybus & Swift Ambari',
      busType: 'Scania High-Deck AC Sleeper (2+1)',
      fromCity: 'Bengaluru',
      toCity: 'Coorg',
      departureTime: '10:30 PM',
      arrivalTime: '05:45 AM',
      duration: '07h 15m',
      fare: 890,
      originalFare: 1150,
      rating: 4.85,
      reviewCount: 4210,
      totalSeats: 36,
      availableSeats: 14,
      amenities: ['Govt Certified Drivers', 'Punctual Dispatch', 'Soft Quilt', 'Luggage Tagging', 'Water Bottle'],
      boardingPoints: ['Majestic Bus Stand (Platform 3)', 'Shantinagar TTMC', 'Satellite Bus Station Mysore Road'],
      droppingPoints: ['Madikeri Bus Stand', 'Kushalnagar Town'],
      registrationNumber: 'KA 01 F 9876',
      status: 'ACTIVE',
      createdAt: '2026-02-05T09:00:00.000Z',
    },
    {
      id: 'bus_srs_blr_hyd',
      operatorName: 'SRS Travels Super Luxury',
      busType: 'Mercedes-Benz Multi-Axle AC Sleeper',
      fromCity: 'Bengaluru',
      toCity: 'Hyderabad',
      departureTime: '09:45 PM',
      arrivalTime: '06:30 AM',
      duration: '08h 45m',
      fare: 1050,
      originalFare: 1390,
      rating: 4.7,
      reviewCount: 2210,
      totalSeats: 36,
      availableSeats: 21,
      amenities: ['Live Tracking', 'Blanket', 'Charging Point', 'Reading Light'],
      boardingPoints: ['Kalasipalyam', 'Madiwala', 'Anand Rao Circle', 'Hebbal'],
      droppingPoints: ['Afzalgunj', 'Lakdikapul', 'Ameerpet', 'Miyapur'],
      registrationNumber: 'KA 51 D 3312',
      status: 'ACTIVE',
      createdAt: '2026-02-10T11:00:00.000Z',
    },
    {
      id: 'bus_shreenath_udaipur_jaipur',
      operatorName: 'Shreenath Solitaire Express',
      busType: 'Volvo AC Sleeper (2+1)',
      fromCity: 'Udaipur',
      toCity: 'Jaipur',
      departureTime: '11:00 PM',
      arrivalTime: '06:00 AM',
      duration: '07h 00m',
      fare: 680,
      originalFare: 890,
      rating: 4.75,
      reviewCount: 950,
      totalSeats: 36,
      availableSeats: 15,
      amenities: ['Water Bottle', 'Charging Socket', 'Reading Lamp', 'AC'],
      boardingPoints: ['Udiapol Bus Stand', 'Reti Stand', 'Bhuwana Bypass'],
      droppingPoints: ['200 Feet Bypass Ajmer Road', 'Sindhi Camp'],
      registrationNumber: 'RJ 27 SB 1204',
      status: 'ACTIVE',
      createdAt: '2026-02-12T14:00:00.000Z',
    },
  ];

  generateSeatLayout(busId: string, fare: number) {
    const seats = [];
    const lowerCols = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
    const upperCols = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12'];

    // Lower Deck
    lowerCols.forEach((num, idx) => {
      seats.push({
        id: `${busId}_${num}`,
        number: num,
        deck: 'LOWER' as const,
        type: 'SLEEPER' as const,
        isBooked: idx % 3 === 0,
        fare,
      });
    });

    // Upper Deck
    upperCols.forEach((num, idx) => {
      seats.push({
        id: `${busId}_${num}`,
        number: num,
        deck: 'UPPER' as const,
        type: 'SLEEPER' as const,
        isBooked: idx % 4 === 1,
        fare: fare + 50,
      });
    });

    return seats;
  }

  async searchBuses(dto: BusSearchDto) {
    let results = this.buses.filter((b) => b.status === 'ACTIVE');

    if (dto.fromCity && dto.fromCity.trim().length > 0) {
      const from = dto.fromCity.trim().toLowerCase();
      results = results.filter((b) => b.fromCity.toLowerCase().includes(from));
    }

    if (dto.toCity && dto.toCity.trim().length > 0) {
      const to = dto.toCity.trim().toLowerCase();
      results = results.filter((b) => b.toCity.toLowerCase().includes(to));
    }

    if (dto.busType && dto.busType.trim().length > 0) {
      const type = dto.busType.trim().toLowerCase();
      results = results.filter((b) => b.busType.toLowerCase().includes(type));
    }

    if (dto.maxFare) {
      results = results.filter((b) => b.fare <= dto.maxFare!);
    }

    // Attach dynamic seat layouts
    return {
      total: results.length,
      fromCity: dto.fromCity,
      toCity: dto.toCity,
      travelDate: dto.travelDate,
      buses: results.map((b) => ({
        ...b,
        seats: this.generateSeatLayout(b.id, b.fare),
      })),
    };
  }

  async getBusById(id: string) {
    const bus = this.buses.find((b) => b.id === id);
    if (!bus) {
      throw new NotFoundException(`Bus service with ID ${id} not found`);
    }
    return {
      ...bus,
      seats: this.generateSeatLayout(bus.id, bus.fare),
    };
  }

  async getAllBuses() {
    return this.buses;
  }

  async createBus(dto: CreateBusDto) {
    const id = `bus_${dto.operatorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newBus: BusItem = {
      id,
      operatorName: dto.operatorName,
      busType: dto.busType,
      fromCity: dto.fromCity,
      toCity: dto.toCity,
      departureTime: dto.departureTime,
      arrivalTime: dto.arrivalTime,
      duration: dto.duration,
      fare: dto.fare,
      originalFare: Math.round(dto.fare * 1.25),
      rating: dto.rating || 4.8,
      reviewCount: 1,
      totalSeats: dto.totalSeats || 36,
      availableSeats: dto.availableSeats || (dto.totalSeats ? Math.round(dto.totalSeats * 0.6) : 22),
      amenities: dto.amenities && dto.amenities.length > 0 ? dto.amenities : ['Live Tracking', 'Clean Blanket', 'Charging Point'],
      boardingPoints: dto.boardingPoints && dto.boardingPoints.length > 0 ? dto.boardingPoints : [`Main Bus Stand ${dto.fromCity}`],
      droppingPoints: dto.droppingPoints && dto.droppingPoints.length > 0 ? dto.droppingPoints : [`Central Stand ${dto.toCity}`],
      registrationNumber: dto.registrationNumber || 'KA 01 AB 1234',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.buses.unshift(newBus);
    return newBus;
  }

  async toggleBusStatus(id: string) {
    const bus = this.buses.find((b) => b.id === id);
    if (!bus) throw new NotFoundException(`Bus ${id} not found`);
    bus.status = bus.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    return bus;
  }

  async deleteBus(id: string) {
    const idx = this.buses.findIndex((b) => b.id === id);
    if (idx === -1) throw new NotFoundException(`Bus ${id} not found`);
    const removed = this.buses.splice(idx, 1)[0];
    return removed;
  }

  getPopularRoutes() {
    return [
      { fromCity: 'New Delhi', toCity: 'Manali', startingFare: 1250, dailyBuses: 28, distanceKm: 535 },
      { fromCity: 'Mumbai', toCity: 'Goa', startingFare: 1100, dailyBuses: 34, distanceKm: 590 },
      { fromCity: 'Bengaluru', toCity: 'Coorg', startingFare: 890, dailyBuses: 18, distanceKm: 265 },
      { fromCity: 'New Delhi', toCity: 'Jaipur', startingFare: 550, dailyBuses: 45, distanceKm: 280 },
      { fromCity: 'Bengaluru', toCity: 'Hyderabad', startingFare: 1050, dailyBuses: 22, distanceKm: 570 },
      { fromCity: 'Udaipur', toCity: 'Jaipur', startingFare: 680, dailyBuses: 16, distanceKm: 395 },
    ];
  }
}
