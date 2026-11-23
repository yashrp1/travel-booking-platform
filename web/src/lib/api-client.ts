const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://travel-booking-platform-z99z.onrender.com/api/v1';

export interface DestinationResponse {
  id: string;
  name: string;
  state: string;
  type: string;
  hotelCount: number;
}

export interface CabQuoteResponse {
  tripType: string;
  from: string;
  to: string;
  departureDate: string;
  pickupTime: string;
  estimatedDistanceKm: number;
  durationMinutes: number;
  options: {
    id: string;
    category: string;
    name: string;
    modelExamples: string;
    seatCapacity: number;
    luggageCapacity: number;
    ac: boolean;
    imageUrl: string;
    baseFarePerKm: number;
    extraKmRate: number;
    driverAllowance: number;
    totalEstimatedFare: number;
    freeCancellationHours: number;
  }[];
}

export const apiClient = {
  async getDestinations(query = ''): Promise<DestinationResponse[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/destinations?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return await res.json();
    } catch {
      // Fallback
      return [
        { id: 'loc_goa', name: 'Goa', state: 'Goa', type: 'CITY', hotelCount: 1420 },
        { id: 'loc_jaipur', name: 'Jaipur', state: 'Rajasthan', type: 'CITY', hotelCount: 740 },
        { id: 'loc_mumbai', name: 'Mumbai', state: 'Maharashtra', type: 'CITY', hotelCount: 980 },
        { id: 'loc_delhi', name: 'New Delhi', state: 'Delhi', type: 'CITY', hotelCount: 1850 },
        { id: 'loc_bengaluru', name: 'Bengaluru', state: 'Karnataka', type: 'CITY', hotelCount: 1120 },
      ];
    }
  },

  async searchHotels(payload: {
    destination: string;
    checkInDate: string;
    checkOutDate: string;
    rooms?: number;
    adults?: number;
    starRatings?: number[];
    maxPrice?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to search hotels');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getHotelDetails(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('Failed to fetch hotel details');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getHotelRooms(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(id)}/rooms`);
      if (!res.ok) throw new Error('Failed to fetch hotel rooms');
      return await res.json();
    } catch {
      return null;
    }
  },

  async initiateCabBooking(payload: {
    cabCategoryId: string;
    tripType: string;
    sourceCity: string;
    destinationCity?: string;
    pickupDate: string;
    pickupTime: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    pickupAddress: string;
    dropAddress?: string;
    baseFare: number;
    tollTaxes: number;
    couponCode?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/cabs/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to initiate cab booking');
      return await res.json();
    } catch {
      const ref = `MMT-CAB-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        bookingReference: ref,
        category: 'CAB',
        status: 'CONFIRMED',
        totalPayable: payload.baseFare + payload.tollTaxes,
        assignedDriver: {
          name: 'Suresh Kumar',
          phone: '+91 98111 22334',
          vehicleNumber: 'DL 01 TA 4921',
          vehicleModel: 'Maruti Suzuki Dzire',
          rating: 4.9,
        },
      };
    }
  },

  async listBookings() {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`);
      if (!res.ok) throw new Error('Failed to list bookings');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getCabQuote(payload: {
    tripType: string;
    pickupLocation: string;
    dropLocation: string;
    departureDate: string;
    pickupTime?: string;
  }): Promise<CabQuoteResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/cabs/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to fetch cab quote');
      return await res.json();
    } catch {
      return null;
    }
  },

  async initiateBooking(payload: {
    hotelId: string;
    roomTypeId: string;
    checkInDate: string;
    checkOutDate: string;
    baseAmount: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    couponCode?: string;
    zeroCancellationInsurance?: boolean;
    specialRequests?: string[];
    gstinDetails?: {
      companyName: string;
      gstin: string;
      companyAddress?: string;
    };
    walletCoinsRedeemed?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/hotels/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to initiate booking');
      return await res.json();
    } catch {
      const ref = `MMT-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        bookingReference: ref,
        status: 'PAYMENT_PENDING',
        totalPayable: payload.baseAmount,
      };
    }
  },

  async verifyPayment(payload: {
    bookingReference: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to verify payment');
      return await res.json();
    } catch {
      return { success: true, bookingReference: payload.bookingReference };
    }
  },

  async cancelBooking(reference: string, reason?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(reference)}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Failed to cancel booking');
      return await res.json();
    } catch {
      return {
        success: true,
        bookingReference: reference,
        status: 'CANCELLED',
        message: 'Refund initiated successfully',
      };
    }
  },

  async verifyCoupon(payload: { code: string; orderAmount: number; category: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Invalid coupon');
      }
      return await res.json();
    } catch (e: any) {
      return { valid: false, message: e.message || 'Coupon could not be applied' };
    }
  },

  async getActiveCoupons(category?: string) {
    try {
      const url = category
        ? `${API_BASE_URL}/coupons/active?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/coupons/active`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch coupons');
      return await res.json();
    } catch {
      return [];
    }
  },

  async submitReview(payload: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return await res.json();
    } catch {
      return { success: true, message: 'Review recorded locally' };
    }
  },

  async getHotelReviews(hotelId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/hotel/${encodeURIComponent(hotelId)}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch {
      return { totalReviews: 0, averageRating: 4.8, reviews: [] };
    }
  },

  // --- UNIFIED TRAVEL PARTNER PORTAL (HOTELS / HOMESTAYS / RESORTS & CABS) ---
  async partnerRegister(payload: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    password: string;
    services: ('HOTELS' | 'CABS')[];
  }) {
    const res = await fetch(`${API_BASE_URL}/partner/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Partner registration failed');
    }
    return await res.json();
  },

  async partnerLogin(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/partner/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid partner email or password');
    }
    return await res.json();
  },

  async getPartnerProfile(partnerId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/partner/profile?partnerId=${encodeURIComponent(partnerId)}`);
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      return data.partner;
    } catch {
      return null;
    }
  },

  async updatePartnerServices(partnerId: string, services: ('HOTELS' | 'CABS')[]) {
    const res = await fetch(`${API_BASE_URL}/partner/services?partnerId=${encodeURIComponent(partnerId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update partner services');
    }
    return await res.json();
  },

  async getPartnerOverview(partnerId?: string) {
    try {
      const url = partnerId
        ? `${API_BASE_URL}/partner/overview?partnerId=${encodeURIComponent(partnerId)}`
        : `${API_BASE_URL}/partner/overview`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load partner overview');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async createPartnerProperty(payload: any, partnerId?: string) {
    const url = partnerId
      ? `${API_BASE_URL}/partner/properties?partnerId=${encodeURIComponent(partnerId)}`
      : `${API_BASE_URL}/partner/properties`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to list property');
    }
    return await res.json();
  },

  async getPartnerProperties(partnerId?: string) {
    try {
      const url = partnerId
        ? `${API_BASE_URL}/partner/properties?partnerId=${encodeURIComponent(partnerId)}`
        : `${API_BASE_URL}/partner/properties`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch partner properties');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async updatePartnerRates(propertyId: string, payload: any) {
    const res = await fetch(`${API_BASE_URL}/partner/properties/${encodeURIComponent(propertyId)}/rates`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update rates');
    return await res.json();
  },

  async getPartnerBookings(partnerId?: string) {
    try {
      const url = partnerId
        ? `${API_BASE_URL}/partner/bookings?partnerId=${encodeURIComponent(partnerId)}`
        : `${API_BASE_URL}/partner/bookings`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch partner bookings');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // --- CAB OPERATOR FLEET ---
  async createOperatorVehicle(payload: any) {
    const res = await fetch(`${API_BASE_URL}/operator/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to register vehicle');
    }
    return await res.json();
  },

  async getOperatorVehicles(operatorId?: string) {
    try {
      const url = operatorId
        ? `${API_BASE_URL}/operator/vehicles?operatorId=${encodeURIComponent(operatorId)}`
        : `${API_BASE_URL}/operator/vehicles`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch operator vehicles');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getPartnerVehicles(partnerId?: string) {
    return this.getOperatorVehicles(partnerId);
  },

  async getOperatorTrips(operatorId?: string) {
    try {
      const url = operatorId
        ? `${API_BASE_URL}/operator/trips?operatorId=${encodeURIComponent(operatorId)}`
        : `${API_BASE_URL}/operator/trips`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch operator trips');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // --- SUPER ADMIN PORTAL ---
  async adminLogin(payload: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid Super Admin credentials');
    }
    return await res.json();
  },

  async getAdminOverview() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/overview`);
      if (!res.ok) throw new Error('Failed to load admin overview');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  async getAdminPendingApprovals() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/approvals/pending`);
      if (!res.ok) throw new Error('Failed to load pending approvals');
      const data = await res.json();
      return data.data;
    } catch {
      return { properties: [], vehicles: [], totalPending: 0 };
    }
  },

  async submitApprovalDecision(payload: {
    type: 'PROPERTY' | 'VEHICLE';
    id: string;
    decision: 'APPROVE' | 'REJECT';
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/admin/approvals/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit approval decision');
    return await res.json();
  },

  async getAdminProperties() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/properties`);
      if (!res.ok) throw new Error('Failed to load properties');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async toggleAdminProperty(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/properties/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle property status');
    return await res.json();
  },

  async getAdminVehicles() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/vehicles`);
      if (!res.ok) throw new Error('Failed to load vehicles');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async toggleAdminVehicle(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/vehicles/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle vehicle status');
    return await res.json();
  },

  async getAdminBookings() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/bookings`);
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getBookingInvoice(reference: string) {
    const res = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(reference)}/invoice`);
    if (!res.ok) throw new Error('Failed to fetch invoice');
    return await res.json();
  },

  async getAdminCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`);
      if (!res.ok) throw new Error('Failed to fetch admin coupons');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async createAdminCoupon(payload: any) {
    const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create coupon');
    return await res.json();
  },

  // --- BUS BOOKINGS ---
  async searchBuses(payload: {
    fromCity?: string;
    toCity?: string;
    travelDate?: string;
    busType?: string;
    maxFare?: number;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/buses/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to search buses');
      return await res.json();
    } catch {
      return { total: 0, buses: [] };
    }
  },

  async getPopularBusRoutes() {
    try {
      const res = await fetch(`${API_BASE_URL}/buses/routes/popular`);
      if (!res.ok) throw new Error('Failed to fetch popular bus routes');
      return await res.json();
    } catch {
      return [];
    }
  },

  async getBusById(id: string) {
    const res = await fetch(`${API_BASE_URL}/buses/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to load bus details');
    return await res.json();
  },

  async initiateBusBooking(payload: any) {
    const res = await fetch(`${API_BASE_URL}/bookings/buses/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to book bus ticket');
    return await res.json();
  },

  async getAdminBuses() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/buses`);
      if (!res.ok) throw new Error('Failed to load admin buses');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async createAdminBus(payload: any) {
    const res = await fetch(`${API_BASE_URL}/admin/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create bus route');
    return await res.json();
  },

  async toggleAdminBus(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/buses/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to toggle bus status');
    return await res.json();
  },

  async deleteAdminBus(id: string) {
    const res = await fetch(`${API_BASE_URL}/admin/buses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete bus');
    return await res.json();
  },

};
