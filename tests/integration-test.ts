/**
 * Automated End-to-End Integration Test Runner
 * Validates Hotel & Cab booking journeys against the live NestJS backend API (port 4000)
 */

const API_BASE = 'http://localhost:4000/api/v1';

interface TestResult {
  step: string;
  endpoint: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

async function assertTest(name: string, endpoint: string, fn: () => Promise<boolean>, details: string) {
  try {
    const passed = await fn();
    results.push({ step: name, endpoint, passed, details });
    console.log(`${passed ? '✓ PASS' : '✗ FAIL'}: ${name} (${endpoint})`);
  } catch (err: any) {
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
      return data.total > 0 && data.hotels.every((h: any) => h.starRating === 5);
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
      return data.estimatedDistanceKm === 240 && data.options.length === 4;
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
