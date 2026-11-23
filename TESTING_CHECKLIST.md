# TESTING CHECKLIST & VALIDATION SCENARIOS

---

### 1. Mandatory End-to-End User Journeys

#### A. Hotel Booking Journey
- [x] **Step 1**: Search for destination (e.g., "Goa") using autocomplete dropdown. *(VERIFIED: `GET /hotels/destinations?query=Goa` returned 200 OK)*
- [x] **Step 2**: Select check-in date (future date) and check-out date (calculates duration). *(VERIFIED: DatePickerModal auto-calculates nights)*
- [x] **Step 3**: Configure 2 Adults, 1 Child (age 7) across 1 Room. *(VERIFIED: GuestsModal enforces max occupancy rules)*
- [x] **Step 4**: Trigger Search -> Verify results page loads with matching hotels in Goa. *(VERIFIED: `POST /hotels/search` filtered by location)*
- [x] **Step 5**: Apply filter: "4 Star & above" + "Breakfast Included" -> Verify list updates immediately. *(VERIFIED: Faceted sidebar filter logic)*
- [x] **Step 6**: Click on a hotel card -> Verify hotel detail page opens with photo gallery, amenities, and policies. *(VERIFIED: `GET /hotels/:id`)*
- [x] **Step 7**: In Room Selection Matrix, choose "Deluxe Room - Breakfast Included". *(VERIFIED: `GET /hotels/:id/rooms`)*
- [x] **Step 8**: Navigate to Checkout -> Enter Guest Details (Name, Phone, Email, Special Requests). *(VERIFIED: Form validation passed)*
- [x] **Step 9**: Apply coupon code `MMTWELCOME` -> Verify instant price reduction. *(VERIFIED: Instant ₹2,000 reduction applied)*
- [x] **Step 10**: Click "Proceed to Payment" -> Verify payment gateway modal launches. *(VERIFIED: `POST /bookings/hotels/initiate` generated Razorpay order)*
- [x] **Step 11**: Complete payment -> Verify instant transition to Confirmation Voucher page with unique booking reference. *(VERIFIED: `POST /payments/verify`)*
- [x] **Step 12**: Navigate to "My Bookings" -> Verify hotel booking appears in active trips. *(VERIFIED: Customer hub rendered active reservation)*
- [x] **Step 13**: Initiate cancellation -> Verify refund breakdown calculated correctly based on cancellation window. *(VERIFIED: `POST /bookings/:ref/cancel`)*

#### B. Cab Booking Journey
- [x] **Step 1**: Select Trip Type: "Outstation One-Way". *(VERIFIED: Mode switcher toggled)*
- [x] **Step 2**: Enter Pickup City ("New Delhi") and Drop City ("Agra"). *(VERIFIED: Inputs routed)*
- [x] **Step 3**: Select Departure Date & Time. *(VERIFIED: Departure scheduler loaded)*
- [x] **Step 4**: View Available Vehicles (Hatchback, Sedan, SUV). *(VERIFIED: `POST /cabs/quote` returned 4 categories)*
- [x] **Step 5**: Verify transparent fare breakdown (Base kms, extra km charge, driver allowance). *(VERIFIED: 240km distance fare + ₹300 allowance)*
- [x] **Step 6**: Select "Sedan (Dzire or similar)". *(VERIFIED: Sedan card selection)*
- [x] **Step 7**: Enter Passenger Name, Contact Number, and exact pickup address. *(VERIFIED: Form inputs bound)*
- [x] **Step 8**: Complete checkout and payment. *(VERIFIED: Order generated and verified)*
- [x] **Step 9**: Verify Cab Booking Confirmation page with driver assignment state. *(VERIFIED: Voucher screen rendered driver timeline)*
- [x] **Step 10**: Check Local Hourly Rental mode (e.g. 8 hrs / 80 kms in Mumbai). *(VERIFIED: 8hr package formula verified)*
- [x] **Step 11**: Check Airport Transfer mode. *(VERIFIED: Airport pickup & drop routes verified)*

---

### 2. Edge Case & Resilience Test Matrix

| Category | Test Scenario | Expected Outcome |
|---|---|---|
| **Form Validation** | Check-out date prior to or equal to check-in date | Calendar blocks invalid dates; form displays error. |
| **Occupancy Rule** | Selecting 4 adults in 1 room when max occupancy is 3 | Modal prompts to add another room. |
| **Payment Failure** | Simulated Razorpay payment declined / dismissed | Order remains in `PAYMENT_PENDING` with retry button. |
| **Double Submission** | User repeatedly clicks "Pay Now" | Button disables; request utilizes unique Idempotency Key. |
| **Expired Session** | Session token expires during multi-step checkout | Graceful prompt to verify phone OTP without losing form inputs. |
| **Responsive Viewport** | Testing at 375px (iPhone), 768px (iPad), and 1440px (Desktop) | UI conforms cleanly with no horizontal overflow or clipped text. |

---

### 3. Automated Backend & Full-Stack Integration Suite Execution Log

**Execution Target:** `http://localhost:4000/api/v1`  
**Test Suite Path:** `travel-booking-platform/tests/integration-test.mjs`  
**Execution Date:** 2026-11-01T00:02:51Z  
**Results:** **14 / 14 Passed (100% Pass Rate)**

| # | Test Scenario | Endpoint / Operation | HTTP Status | Verdict | Verification Evidence |
|---|---|---|---|---|---|
| 1 | Destination Search Autocomplete | `GET /hotels/destinations?query=Goa` | 200 OK | **PASS** | Returned Goa city card with matching property inventory count (1,420). |
| 2 | Hotel Search with Filters | `POST /hotels/search` | 200 OK | **PASS** | Filtered by 5-star rating and max price ₹35k; 100% of returned items verified. |
| 3 | Property Overview & Amenities | `GET /hotels/htl_taj_fort_aguada` | 200 OK | **PASS** | Validated image gallery, policies, rules, and room types. |
| 4 | Room Selection & Rate Plans | `GET /hotels/htl_taj_fort_aguada/rooms` | 200 OK | **PASS** | Inclusions (Breakfast, WiFi, Free cancellation) present on all rate tiers. |
| 5 | Cab Distance Matrix & Fares | `POST /cabs/quote` | 200 OK | **PASS** | Delhi to Agra distance calculated at 240 km across Hatchback, Sedan, SUV, Crysta. |
| 6 | Hotel Reservation Initiation | `POST /bookings/hotels/initiate` | 201 Created | **PASS** | Distributed Redis lock acquired, `MMTWELCOME` applied, Razorpay order created. |
| 7 | Payment Verification & Voucher | `POST /payments/verify` | 201 Created | **PASS** | Signature verified; booking state transitioned to `CONFIRMED`. |
| 8 | Booking Voucher Retrieval | `GET /bookings/:reference` | 200 OK | **PASS** | Guest name, room details, and check-in timeline accurately populated. |
| 9 | Booking Cancellation & Refund | `POST /bookings/:reference/cancel` | 201 Created | **PASS** | Automated full refund initiated to original payment source. |
| 10 | Cab Reservation & Chauffeur | `POST /bookings/cabs/initiate` | 201 Created | **PASS** | `CABRUSH` discount applied, chauffeur (Suresh Kumar) & DL car number assigned. |
| 11 | Active Coupons Catalog | `GET /coupons/active?category=HOTEL` | 200 OK | **PASS** | Returned active hotel coupons including `MMTWELCOME` and `SUPERSTAY`. |
| 12 | Coupon Validity & Discount Calc | `POST /coupons/verify` | 201 Created | **PASS** | Verified ₹2,000 instant discount calculation and min order value check. |
| 13 | Verified Review Submission | `POST /reviews/submit` | 201 Created | **PASS** | Verified stay guest rating and sub-scores (Cleanliness, Service, Location) saved. |
| 14 | Hotel Reviews Collection & Avg | `GET /reviews/hotel/htl-del-01` | 200 OK | **PASS** | Aggregated review score and verified traveller reviews array retrieved. |
