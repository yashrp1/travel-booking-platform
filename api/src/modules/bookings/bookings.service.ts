import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InitiateHotelBookingDto } from './dto/initiate-booking.dto';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class BookingsService {
  private readonly bookings = new Map<string, any>();

  constructor(private readonly redisService: RedisService) {
    // Seed initial active bookings
    this.bookings.set('MMT-HTL-202611-9872', {
      bookingReference: 'MMT-HTL-202611-9872',
      category: 'HOTEL',
      status: 'CONFIRMED',
      hotelName: 'Taj Fort Aguada Resort & Spa',
      city: 'Goa',
      checkInDate: '2026-11-15',
      checkOutDate: '2026-11-18',
      leadGuestName: 'Mr Rahul Sharma',
      totalPayable: 15110,
      createdAt: new Date().toISOString(),
    });

    this.bookings.set('MMT-CAB-202611-4412', {
      bookingReference: 'MMT-CAB-202611-4412',
      category: 'CAB',
      status: 'CONFIRMED',
      cabName: 'Sedan – Dzire or similar',
      fromCity: 'New Delhi',
      toCity: 'Agra',
      departureDate: '2026-11-12',
      departureTime: '07:00 AM',
      totalPayable: 3420,
      createdAt: new Date().toISOString(),
    });

    this.bookings.set('MMT-HTL-202611-3180', {
      bookingReference: 'MMT-HTL-202611-3180',
      category: 'HOTEL',
      status: 'CONFIRMED',
      hotelName: 'Mövenpick Hotel Jakarta',
      city: 'Jakarta',
      checkInDate: '2026-11-28',
      checkOutDate: '2026-12-01',
      leadGuestName: 'Mr Rahul Sharma',
      leadGuestEmail: 'rahul.sharma@example.com',
      leadGuestPhone: '+919876543210',
      totalPayable: 18500,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    });

    this.bookings.set('MMT-HTL-202610-8452', {
      bookingReference: 'MMT-HTL-202610-8452',
      category: 'HOTEL',
      status: 'COMPLETED',
      hotelName: 'Grand Hyatt Hotel & Residences',
      city: 'Mumbai',
      checkInDate: '2026-10-10',
      checkOutDate: '2026-10-13',
      leadGuestName: 'Mr Rahul Sharma',
      leadGuestEmail: 'rahul.sharma@example.com',
      leadGuestPhone: '+919876543210',
      totalPayable: 9800,
      createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    });
  }

  async initiateHotelBooking(dto: InitiateHotelBookingDto) {
    // Acquire distributed lock to prevent double-booking race condition during concurrent checkout
    const lockKey = `lock:room:${dto.roomTypeId}:${dto.checkInDate}`;
    const acquired = await this.redisService.acquireLock(lockKey, dto.guestEmail, 30000);
    if (!acquired) {
      throw new ConflictException('This room is currently being reserved by another guest. Please try another room.');
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `MMT-HTL-202611-${randomSuffix}`;

    const discountAmount =
      dto.couponCode?.toUpperCase() === 'MMTWELCOME' ? 2000 :
      dto.couponCode?.toUpperCase() === 'LUXURY2000' ? 2000 :
      dto.couponCode?.toUpperCase() === 'WEEKENDSTAY' ? 1200 : 0;

    const zeroCancellationFee = dto.zeroCancellationInsurance ? 299 : 0;
    const walletDeduction = dto.walletCoinsRedeemed ? Math.min(500, dto.walletCoinsRedeemed) : 0;
    const taxesAndFees = Math.round(dto.baseAmount * 0.18);
    const totalPayable = Math.max(0, dto.baseAmount + taxesAndFees + zeroCancellationFee - discountAmount - walletDeduction);

    const booking = {
      bookingReference,
      category: 'HOTEL',
      status: 'PAYMENT_PENDING',
      hotelId: dto.hotelId,
      roomTypeId: dto.roomTypeId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      leadGuestName: dto.guestName,
      leadGuestEmail: dto.guestEmail,
      leadGuestPhone: dto.guestPhone,
      baseAmount: dto.baseAmount,
      taxesAndFees,
      zeroCancellationInsurance: !!dto.zeroCancellationInsurance,
      zeroCancellationFee,
      specialRequests: dto.specialRequests || [],
      gstinDetails: dto.gstinDetails || null,
      walletCoinsRedeemed: walletDeduction,
      discountAmount,
      totalPayable,
      razorpayOrderId: `order_rzp_${randomSuffix}${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(bookingReference, booking);

    return booking;
  }

  async initiateCabBooking(dto: any) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `MMT-CAB-202611-${randomSuffix}`;

    const discountAmount = dto.couponCode?.toUpperCase() === 'CABRUSH' ? 300 : 0;
    const gst = Math.round(dto.baseFare * 0.05);
    const totalPayable = Math.max(0, dto.baseFare + dto.tollTaxes + gst - discountAmount);

    const booking = {
      bookingReference,
      category: 'CAB',
      status: 'CONFIRMED',
      cabCategoryId: dto.cabCategoryId,
      tripType: dto.tripType,
      sourceCity: dto.sourceCity,
      destinationCity: dto.destinationCity,
      pickupDate: dto.pickupDate,
      pickupTime: dto.pickupTime,
      passengerName: dto.passengerName,
      passengerEmail: dto.passengerEmail,
      passengerPhone: dto.passengerPhone,
      pickupAddress: dto.pickupAddress,
      dropAddress: dto.dropAddress,
      baseFare: dto.baseFare,
      tollTaxes: dto.tollTaxes,
      gst,
      discountAmount,
      totalPayable,
      assignedDriver: {
        name: 'Suresh Kumar',
        phone: '+91 98111 22334',
        vehicleNumber: 'DL 01 TA 4921',
        vehicleModel: 'Maruti Suzuki Dzire',
        rating: 4.9,
      },
      razorpayOrderId: `order_cab_${randomSuffix}${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(bookingReference, booking);

    return booking;
  }

  async getBookingByReference(reference: string) {
    const booking = this.bookings.get(reference);
    if (!booking) {
      throw new NotFoundException(`Booking reference ${reference} not found`);
    }
    return booking;
  }

  
  async initiateBusBooking(dto: any) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `MMT-BUS-202611-${randomSuffix}`;

    const seatsCount = Array.isArray(dto.seatNumbers) ? dto.seatNumbers.length : 1;
    const baseAmount = Number(dto.baseAmount) || (1250 * seatsCount);
    const gst = Math.round(baseAmount * 0.05);
    const totalPayable = baseAmount + gst;

    const booking = {
      bookingReference,
      pnr: `WNDR${randomSuffix}BUS`,
      category: 'BUS',
      status: 'CONFIRMED',
      busId: dto.busId,
      busOperator: dto.operatorName || 'Zingbus Plus Electric & Luxury',
      busType: dto.busType || 'BharatBenz AC Sleeper (2+1)',
      fromCity: dto.fromCity || 'New Delhi',
      toCity: dto.toCity || 'Manali',
      travelDate: dto.travelDate || '2026-11-25',
      departureTime: dto.departureTime || '08:30 PM',
      arrivalTime: dto.arrivalTime || '07:30 AM',
      seatNumbers: dto.seatNumbers || ['L4'],
      boardingPoint: dto.boardingPoint || 'Kashmere Gate ISBT',
      droppingPoint: dto.droppingPoint || 'Private Bus Stand Manali',
      passengerName: dto.passengerName || dto.leadGuestName || 'Traveler',
      passengerEmail: dto.passengerEmail || dto.leadGuestEmail || 'traveler@wanderstay.com',
      passengerPhone: dto.passengerPhone || dto.leadGuestPhone || '+91 98765 43210',
      baseAmount,
      gst,
      totalPayable,
      razorpayOrderId: `order_rzp_${randomSuffix}${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };

    this.bookings.set(bookingReference, booking);
    return booking;
  }

async getBookingInvoice(reference: string) {
    const booking = await this.getBookingByReference(reference);
    const suffix = reference.replace(/[^0-9]/g, '').slice(-6) || '102938';

    const baseCost = booking.baseAmount || booking.baseFare || 10000;
    const taxAmt = booking.taxesAndFees || booking.gst || Math.round(baseCost * 0.18);
    const halfTax = Math.round(taxAmt / 2);

    return {
      invoiceNumber: `INV-2026-${suffix}`,
      invoiceDate: booking.createdAt,
      bookingReference: booking.bookingReference,
      category: booking.category,
      serviceDescription:
        booking.category === 'HOTEL'
          ? 'Hotel & Short-Term Luxury Accommodation Services'
          : 'Passenger Transport by Commercial Chauffeur Driven Cab',
      sacCode: booking.category === 'HOTEL' ? '996311' : '996412',
      supplier: {
        legalName: 'WanderStay Travel Technologies Pvt Ltd',
        brandName: 'WanderStay Edition',
        gstin: '07AAAAW9876P1Z4',
        pan: 'AAAAW9876P',
        cin: 'U63040DL2026PTC398201',
        address: 'Tower B, Cyber Greens, DLF Phase 3, Gurugram, Haryana 122002',
        state: 'Haryana (07)',
      },
      billedTo: {
        customerName: booking.leadGuestName || booking.passengerName || 'Verified Traveler',
        customerEmail: booking.leadGuestEmail || booking.passengerEmail || 'traveler@example.com',
        customerPhone: booking.leadGuestPhone || booking.passengerPhone || '+91 98765 43210',
        companyName: booking.gstinDetails?.companyName || null,
        gstin: booking.gstinDetails?.gstin || null,
        companyAddress: booking.gstinDetails?.companyAddress || null,
      },
      lineItems: [
        {
          description: booking.hotelName || booking.cabName || `${booking.category} Service`,
          sacCode: booking.category === 'HOTEL' ? '996311' : '996412',
          baseAmount: baseCost,
          cgstRate: booking.category === 'HOTEL' ? '9%' : '2.5%',
          cgstAmount: halfTax,
          sgstRate: booking.category === 'HOTEL' ? '9%' : '2.5%',
          sgstAmount: halfTax,
          insuranceAddon: booking.zeroCancellationFee || 0,
          discount: booking.discountAmount || 0,
          walletRedeemed: booking.walletCoinsRedeemed || 0,
          totalPayable: booking.totalPayable,
        },
      ],
      paymentStatus: 'PAID IN FULL',
      paymentMode: 'RAZORPAY GATEWAY',
      authorizedSignatory: 'WanderStay Finance & Tax Compliance',
    };
  }

  async cancelBooking(reference: string, reason?: string) {
    const booking = await this.getBookingByReference(reference);
    booking.status = 'CANCELLED';
    booking.cancellationReason = reason || 'Customer requested online cancellation';
    booking.refundAmount = booking.totalPayable;
    booking.refundStatus = 'PROCESSED_TO_RAZORPAY';

    this.bookings.set(reference, booking);

    return {
      success: true,
      bookingReference: reference,
      status: 'CANCELLED',
      refundAmount: booking.refundAmount,
      message: 'Full refund initiated to original payment source.',
    };
  }

  async listAllBookings() {
    return Array.from(this.bookings.values());
  }
}
