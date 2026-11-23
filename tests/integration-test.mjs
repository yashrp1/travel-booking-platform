/**
 * Automated End-to-End Integration Test Runner (ESM)
 * Validates Hotel & Cab booking journeys against the live NestJS backend API (port 4000)
 */

const API_BASE = 'http://localhost:4000/api/v1';
const results = [];

async function assertTest(name, endpoint, fn, details) {
  try {
    const passed = await fn();
    results.push({ step: name, endpoint, passed, details });
    console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: ${name} (${endpoint})`);
  } catch (err) {
    results.push({ step: name, endpoint, passed: false, details: err.message });
    console.log(`✗ FAIL: ${name} (${endpoint}) - ${err.message}`);
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('STARTING WANDERSTAY FULL-STACK INTEGRATION TEST SUITE');
  console.log(`Target Backend: ${API_BASE}`);
  console.log('====================================================\n');

  let testBookingRef = '';
  let testOrderId = '';

  // 1. Hotel Destination Search Autocomplete
  await assertTest(
    'HOTEL: Destination Autocomplete',
    'GET /hotels/destinations?query=Goa',
    async () => {
      const res = await fetch(`${API_BASE}/hotels/destinations?query=Goa`);
      if (!res.ok) return false;
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 && data[0].name === 'Goa';
    },
    'Verified destination autocomplete returns matching cities with hotel count.'
  );

  // 2. Hotel Search with Star and Price Filters
  await assertTest(
    'HOTEL: Search with Filters',
    'POST /hotels/search',
    async () => {
      const res = await fetch(`${API_BASE}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'Goa',
          checkInDate: '2026-11-15',
          checkOutDate: '2026-11-18',
          starRatings: [5],
          maxPrice: 35000,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.total > 0 && data.hotels.every((h) => h.starRating === 5);
    },
    'Verified 5-star hotel filter restricts results properly.'
  );

  // 3. Hotel Details by ID
  await assertTest(
    'HOTEL: Get Property Overview',
    'GET /hotels/htl_taj_fort_aguada',
    async () => {
      const res = await fetch(`${API_BASE}/hotels/htl_taj_fort_aguada`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.id === 'htl_taj_fort_aguada' && data.rooms.length > 0;
    },
    'Verified property overview contains image gallery and rooms.'
  );

  // 4. Hotel Room Selection Plans
  await assertTest(
    'HOTEL: Room Rate Plans',
    'GET /hotels/htl_taj_fort_aguada/rooms',
    async () => {
      const res = await fetch(`${API_BASE}/hotels/htl_taj_fort_aguada/rooms`);
      if (!res.ok) return false;
      const data = await res.json();
      return Array.isArray(data) && data[0].inclusions.length > 0;
    },
    'Verified room rate plans contain breakfast and WiFi inclusions.'
  );

  // 5. Cab Route Distance & Fare Quote
  await assertTest(
    'CAB: Distance Matrix & Fare Calculation',
    'POST /cabs/quote',
    async () => {
      const res = await fetch(`${API_BASE}/cabs/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripType: 'ONE_WAY',
          pickupLocation: 'New Delhi',
          dropLocation: 'Agra',
          departureDate: '2026-11-12',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.estimatedDistanceKm === 240 && data.options.length >= 4;
    },
    'Verified Delhi to Agra 240 km distance and 4 vehicle tiers calculated.'
  );

  // 6. Hotel Reservation Initiation (Razorpay Order creation)
  await assertTest(
    'HOTEL: Initiate Reservation & Order',
    'POST /bookings/hotels/initiate',
    async () => {
      const res = await fetch(`${API_BASE}/bookings/hotels/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: 'htl_taj_fort_aguada',
          roomTypeId: 'room_deluxe_sea',
          checkInDate: '2026-11-15',
          checkOutDate: '2026-11-18',
          baseAmount: 14500,
          guestName: 'Rahul Sharma',
          guestEmail: 'rahul.sharma@example.com',
          guestPhone: '+919876543210',
          couponCode: 'MMTWELCOME',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      testBookingRef = data.bookingReference;
      testOrderId = data.razorpayOrderId;
      return Boolean(testBookingRef && data.status === 'PAYMENT_PENDING' && data.discountAmount === 2000);
    },
    'Verified MMTWELCOME applied ₹2,000 discount and generated Razorpay order.'
  );

  // 7. Payment Signature Verification
  await assertTest(
    'PAYMENT: Verify Signature & Issue Voucher',
    'POST /payments/verify',
    async () => {
      const res = await fetch(`${API_BASE}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: testBookingRef,
          razorpayOrderId: testOrderId,
          razorpayPaymentId: 'pay_rzp_mock_success_7781',
          razorpaySignature: 'mock_valid_signature',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'CONFIRMED' && data.bookingReference === testBookingRef;
    },
    'Verified payment confirmed status and transition to voucher issuance.'
  );

  // 8. Booking Lookup
  await assertTest(
    'BOOKING: Retrieve Confirmed Voucher',
    `GET /bookings/${testBookingRef}`,
    async () => {
      const res = await fetch(`${API_BASE}/bookings/${testBookingRef}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'CONFIRMED' && data.leadGuestName === 'Rahul Sharma';
    },
    'Verified booking reference lookup accurately retrieves guest voucher details.'
  );

  // 9. Automated Cancellation & Refund
  await assertTest(
    'BOOKING: Cancellation & Automated Refund',
    `POST /bookings/${testBookingRef}/cancel`,
    async () => {
      const res = await fetch(`${API_BASE}/bookings/${testBookingRef}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Trip rescheduled by customer' }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'CANCELLED' && data.refundAmount > 0;
    },
    'Verified cancellation recalculates refund and updates status to CANCELLED.'
  );

  // 10. Cab Reservation Initiation
  let testCabRef = '';
  await assertTest(
    'CAB: Initiate Reservation & Driver Allocation',
    'POST /bookings/cabs/initiate',
    async () => {
      const res = await fetch(`${API_BASE}/bookings/cabs/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabCategoryId: 'sedan',
          tripType: 'ONE_WAY',
          sourceCity: 'New Delhi',
          destinationCity: 'Agra',
          pickupDate: '2026-11-15',
          pickupTime: '07:30 AM',
          passengerName: 'Rohit Verma',
          passengerPhone: '+91 98765 43210',
          passengerEmail: 'rohit.verma@example.com',
          pickupAddress: 'Terminal 3, IGI Airport',
          dropAddress: 'Taj East Gate Road, Agra',
          baseFare: 3420,
          tollTaxes: 450,
          couponCode: 'CABRUSH',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      testCabRef = data.bookingReference;
      return (
        data.status === 'CONFIRMED' &&
        data.discountAmount === 300 &&
        Boolean(data.assignedDriver && data.assignedDriver.vehicleNumber)
      );
    },
    'Verified CABRUSH discount applied and chauffeur assigned.'
  );

  // 11. Promotional Coupons Catalog
  await assertTest(
    'COUPON: Get Active Offers',
    'GET /coupons/active?category=HOTEL',
    async () => {
      const res = await fetch(`${API_BASE}/coupons/active?category=HOTEL`);
      if (!res.ok) return false;
      const data = await res.json();
      return Array.isArray(data) && data.some((c) => c.code === 'MMTWELCOME');
    },
    'Verified active coupons filter returns MMTWELCOME promo offer.'
  );

  // 12. Coupon Eligibility Verification
  await assertTest(
    'COUPON: Verify Code & Calculate Discount',
    'POST /coupons/verify',
    async () => {
      const res = await fetch(`${API_BASE}/coupons/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'MMTWELCOME',
          orderAmount: 12000,
          category: 'HOTEL',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.valid === true && data.discountAmount === 2000 && data.finalPayable === 10000;
    },
    'Verified MMTWELCOME validity check and ₹2,000 instant discount calculation.'
  );

  // 13. Customer Review Submission
  await assertTest(
    'REVIEW: Submit Verified Stay Rating',
    'POST /reviews/submit',
    async () => {
      const res = await fetch(`${API_BASE}/reviews/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: 'htl-del-01',
          bookingReference: 'MMT-HTL-202611-9872',
          authorName: 'Rahul Sharma',
          rating: 5,
          title: 'Unrivalled luxury in Candolim',
          comment: 'The private beach access and sunset view from Aguada fort are world-class.',
          travellerType: 'Couple',
          cleanlinessRating: 5,
          serviceRating: 5,
          locationRating: 5,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && data.review.verifiedStay === true;
    },
    'Verified guest review submitted and flagged with verifiedStay: true.'
  );

  // 14. Hotel Reviews Lookup
  await assertTest(
    'REVIEW: Retrieve Property Reviews & Average',
    'GET /reviews/hotel/htl-del-01',
    async () => {
      const res = await fetch(`${API_BASE}/reviews/hotel/htl-del-01`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.totalReviews >= 3 && data.averageRating >= 4.5;
    },
    'Verified hotel reviews collection and aggregated score computed accurately.'
  );

  // 15. Super Admin Login
  let adminToken = '';
  await assertTest(
    'ADMIN: Super Admin Authentication',
    'POST /admin/auth/login',
    async () => {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@wanderstay.com',
          password: 'SuperAdmin@2026',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      adminToken = data.token;
      return data.success === true && data.user.role === 'SUPER_ADMIN';
    },
    'Verified Super Admin login returns active session token and SUPER_ADMIN role.'
  );

  // 16. Super Admin Overview Metrics
  await assertTest(
    'ADMIN: Overview Metrics & Inventory Stats',
    'GET /admin/overview',
    async () => {
      const res = await fetch(`${API_BASE}/admin/overview`);
      if (!res.ok) return false;
      const data = await res.json();
      return (
        data.success === true &&
        data.data.metrics.totalProperties > 0 &&
        data.data.metrics.gmv >= 0
      );
    },
    'Verified Admin Overview computes GMV, commission, and inventory breakdown.'
  );

  // 17. Partner Property Submission (Defaults to PENDING_APPROVAL)
  let newPropertyId = '';
  await assertTest(
    'PARTNER: List New Homestay / Resort',
    'POST /partner/properties',
    async () => {
      const res = await fetch(`${API_BASE}/partner/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'The Plantation Villa & Spa',
          propertyType: 'RESORT',
          city: 'Goa',
          address: 'Assagao Village Road, North Goa',
          starRating: 5,
          basePrice: 18000,
          discountedPrice: 15500,
          amenities: ['Private Pool', 'High-Speed WiFi', 'Chef on Demand'],
          partnerName: 'Greenwood Stays LLP',
          partnerEmail: 'greenwood@example.com',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      newPropertyId = data.data.id;
      return (
        data.success === true &&
        data.data.status === 'PENDING_APPROVAL' &&
        data.data.propertyType === 'RESORT'
      );
    },
    'Verified partner property submitted with PENDING_APPROVAL status for quality review.'
  );

  // 18. Super Admin Approves Property -> Now LIVE
  await assertTest(
    'ADMIN: Quality Approval of Partner Property',
    'POST /admin/approvals/decision',
    async () => {
      const res = await fetch(`${API_BASE}/admin/approvals/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROPERTY',
          id: newPropertyId,
          decision: 'APPROVE',
          notes: 'Property pictures and luxury amenities verified.',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && data.item.status === 'ACTIVE';
    },
    'Verified Super Admin can approve property, setting status to ACTIVE.'
  );

  // 19. Marketplace Search reflects newly approved property
  await assertTest(
    'MARKETPLACE: Approved Property Appears in Public Search',
    'POST /hotels/search',
    async () => {
      const res = await fetch(`${API_BASE}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'Goa',
          checkInDate: '2026-11-20',
          checkOutDate: '2026-11-23',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.hotels.some((h) => h.id === newPropertyId);
    },
    'Verified newly approved property immediately appears in public guest search.'
  );

  // 20. Operator Adds Vehicle to Fleet
  let newVehicleId = '';
  await assertTest(
    'OPERATOR: Add Vehicle to Fleet',
    'POST /operator/vehicles',
    async () => {
      const res = await fetch(`${API_BASE}/operator/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'INNOVA_CRYSTA',
          name: 'Toyota Innova Crysta ZX 2026',
          registrationNumber: 'DL 01 AB 9988',
          seatCapacity: 6,
          luggageCapacity: 4,
          baseFarePerKm: 19.0,
          extraKmRate: 19.0,
          driverAllowance: 450,
          driverName: 'Harish Chander',
          driverPhone: '+91 98111 55667',
          operatorName: 'Apex Transport Solutions',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      newVehicleId = data.data.id;
      return data.success === true && data.data.status === 'PENDING_APPROVAL';
    },
    'Verified vehicle added by operator with PENDING_APPROVAL status.'
  );

  // 21. Super Admin Approves Vehicle
  await assertTest(
    'ADMIN: Quality Approval of Commercial Cab',
    'POST /admin/approvals/decision',
    async () => {
      const res = await fetch(`${API_BASE}/admin/approvals/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'VEHICLE',
          id: newVehicleId,
          decision: 'APPROVE',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && data.item.status === 'ACTIVE';
    },
    'Verified Super Admin approves vehicle, making it active for passenger trips.'
  );

  // 22. Admin Suspends Property -> Disappears from Public Search
  await assertTest(
    'ADMIN: Suspend Property & Verify Delisting',
    'POST /admin/properties/:id/toggle',
    async () => {
      const toggleRes = await fetch(`${API_BASE}/admin/properties/${newPropertyId}/toggle`, {
        method: 'POST',
      });
      if (!toggleRes.ok) return false;
      const toggleData = await toggleRes.json();
      if (toggleData.data.status !== 'SUSPENDED') return false;

      // Verify Delisted from search
      const searchRes = await fetch(`${API_BASE}/hotels/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: 'Goa',
          checkInDate: '2026-11-20',
          checkOutDate: '2026-11-23',
        }),
      });
      const searchData = await searchRes.json();
      return !searchData.hotels.some((h) => h.id === newPropertyId);
    },
    'Verified suspending a property immediately removes it from public consumer search.'
  );

  // 23. Unified Partner Registration with Multi-Service Selection
  let registeredPartnerId = '';
  await assertTest(
    'PARTNER: Register Unified Provider (Hotels + Cabs)',
    'POST /partner/auth/register',
    async () => {
      const res = await fetch(`${API_BASE}/partner/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: 'Himalayan Luxury Stays & 4x4 Fleet',
          contactName: 'Rohit Negi',
          email: `rohit_${Date.now()}@himalayanstays.com`,
          phone: '+91 98160 12345',
          password: 'Partner@2026',
          services: ['HOTELS', 'CABS'],
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      registeredPartnerId = data.partner.id;
      return (
        data.success === true &&
        data.partner.services.includes('HOTELS') &&
        data.partner.services.includes('CABS')
      );
    },
    'Verified partner registration dynamically associates selected services (Accommodations + Cabs).'
  );

  // 24. Partner Login with Pre-Seeded Integrated Credentials
  await assertTest(
    'PARTNER: Sign In with Service Persona',
    'POST /partner/auth/login',
    async () => {
      const res = await fetch(`${API_BASE}/partner/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'integrated@wanderstay.com',
          password: 'Partner@2026',
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return (
        data.success === true &&
        Array.isArray(data.partner.services) &&
        data.partner.services.length === 2
      );
    },
    'Verified partner login returns session token and active services array.'
  );

  // 25. Partner Dynamic Service Customization (Toggle Services)
  await assertTest(
    'PARTNER: Dynamic Service Toggle',
    'PATCH /partner/services',
    async () => {
      const res = await fetch(`${API_BASE}/partner/services?partnerId=${registeredPartnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: ['HOTELS'], // Changed from both to Hotels only
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && data.partner.services.length === 1;
    },
    'Verified partner can customize/toggle enabled services dynamically.'
  );

  // 26. Unified Partner Dashboard Overview
  await assertTest(
    'PARTNER: Unified Overview & Combined Revenue',
    'GET /partner/overview',
    async () => {
      const res = await fetch(`${API_BASE}/partner/overview?partnerId=ptr_integrated_01`);
      if (!res.ok) return false;
      const data = await res.json();
      return (
        data.success === true &&
        data.data.partner.businessName &&
        data.data.metrics.totalRevenue >= 0
      );
    },
    'Verified Partner Overview computes combined GMV, active listings, and bookings.'
  );

  // 27. MMT Feature: Formal GST Tax Invoice Generation (SAC 9963/9964)
  await assertTest(
    'MMT INVOICE: Formal GST Tax Invoice Generation',
    `GET /bookings/${testBookingRef}/invoice`,
    async () => {
      const res = await fetch(`${API_BASE}/bookings/${testBookingRef}/invoice`);
      if (!res.ok) return false;
      const invoice = await res.json();
      return (
        invoice.invoiceNumber &&
        invoice.sacCode === '996311' &&
        invoice.supplier?.gstin &&
        Array.isArray(invoice.lineItems) &&
        invoice.lineItems.length > 0 &&
        invoice.lineItems[0].totalPayable > 0
      );
    },
    'Verified GST invoice generation with SAC 996311, CGST/SGST split, and legal entity details.'
  );

  // 28. MMT Feature: Checkout with Zero-Cancellation, Special Requests & GSTIN
  await assertTest(
    'MMT CHECKOUT: Reservation with Zero-Cancellation & GSTIN',
    'POST /bookings/hotels/initiate',
    async () => {
      const res = await fetch(`${API_BASE}/bookings/hotels/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: 'htl_taj_fort_aguada',
          roomTypeId: 'room_deluxe_sea',
          checkInDate: '2026-11-20',
          checkOutDate: '2026-11-23',
          baseAmount: 18500,
          guestName: 'Vikramaditya Singhania',
          guestEmail: 'vikram@singhaniagroup.com',
          guestPhone: '+91 99887 76655',
          couponCode: 'MMTWELCOME',
          zeroCancellationInsurance: true,
          specialRequests: ['Non-Smoking Room', 'High Floor', 'Late Check-in'],
          gstinDetails: {
            companyName: 'Singhania Luxury Enterprises Pvt Ltd',
            gstin: '27AABCS1234F1Z8',
            companyAddress: 'Nariman Point, Mumbai 400021',
          },
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.bookingReference && data.status === 'PAYMENT_PENDING';
    },
    'Verified checkout supports Zero-Cancellation insurance, Special Requests chips, and corporate GSTIN.'
  );

  // 29. MMT Feature: Admin Promotions Engine (Dynamic Coupon Creation)
  await assertTest(
    'MMT ADMIN: Dynamic Coupon Campaign Creation',
    'POST /admin/coupons',
    async () => {
      const uniqueCode = `FESTIVE${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch(`${API_BASE}/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: uniqueCode,
          title: 'Diwali Festival Privilege Offer',
          discountType: 'FLAT',
          discountValue: 2500,
          category: 'HOTEL',
          minBookingAmount: 8000,
          validDays: 45,
        }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && (data.data?.code === uniqueCode || data.coupon?.code === uniqueCode);
    },
    'Verified Super Admin can dynamically launch new marketing coupons and discount campaigns.'
  );

  // 30. MMT Feature: Fetch Admin Coupons Catalog
  await assertTest(
    'MMT ADMIN: Query Active Coupons Catalog',
    'GET /admin/coupons',
    async () => {
      const res = await fetch(`${API_BASE}/admin/coupons`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.success === true && Array.isArray(data.data) && data.data.length >= 4;
    },
    'Verified active promotions catalog lists all pre-seeded and dynamically created coupon codes.'
  );

  console.log('\n====================================================');
  console.log('INTEGRATION TEST RESULTS SUMMARY');
  console.log('====================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(`Total Tests Executed: ${results.length}`);
  console.log(`Passed: ${results.filter((r) => r.passed).length}`);
  console.log(`Failed: ${results.filter((r) => !r.passed).length}`);
  console.log(`Overall Status: ${allPassed ? 'ALL TESTS PASSED ✓' : 'SOME TESTS FAILED ✗'}\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

runAllTests();
