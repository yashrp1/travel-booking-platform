# CHANGELOG

All notable changes to the Travel Booking Platform project will be documented in this file.
The format is based on Keep a Changelog.

---

## [Unreleased] - 2026-11-01

### Added
- **Project Master Documentation Foundation**:
  - `PROJECT_MASTER_PLAN.md`: Strategic roadmap, technical stack decisions, milestone gates.
  - `MODULES_MASTER_LIST.md`: Exhaustive 22-module inventory with status, submodules, and API requirements.
  - `DEVELOPMENT_TODO.md`: Detailed discrete task tracker with unique IDs (T-001 through T-033).
  - `PROJECT_PROGRESS.md`: Executive dashboard with progress percentages.
  - `ARCHITECTURE.md`: High-level system architecture, client/server boundaries, and concurrency rules.
  - `DATABASE_SCHEMA.md`: PostgreSQL relational schema with tables, foreign keys, and indexes.
  - `API_DOCUMENTATION.md`: Complete REST API contracts for auth, hotels, cabs, payments, and webhooks.
  - `UI_UX_GUIDELINES.md`: MakeMyTrip design benchmarks, color tokens, and screen interaction patterns.
  - `INTEGRATION_TRACKER.md`: Third-party integration status and mock adapter specifications.
  - `TESTING_CHECKLIST.md`: End-to-end hotel and cab testing journeys and edge cases.
  - `BUG_TRACKER.md`: Systematic defect classification and resolution tracking.
  - `DECISIONS.md`: Architectural Decision Records (ADRs).
  - `DEPLOYMENT_GUIDE.md`: Containerization, CI/CD, and production deployment manual.
- Node.js v20.20.2 LTS & npm v10.8.2 runtime environment configured.
- **Phase 1 Web Application Implementation**:
  - `Header`: MakeMyTrip dark navy sticky navigation with Hotels & Cabs category tabs, 24x7 Support, currency selector (INR ₹), and My Trips link.
  - `AuthModal`: Mobile Phone OTP authentication modal with test verification code `482910`.
  - `HeroSearchContainer`: 4-tile MakeMyTrip search card with dual mode switch (Hotels vs Cabs), destination autocomplete, dual-month date range picker, and rooms/guest stepper modal.
  - `OffersSection`: Dynamic coupon vouchers (`MMTWELCOME`, `CABFIRST`, `HDFCTRAVEL`, `WEEKENDSTAY`) with 1-click copy code functionality.
  - `FeaturedHotels`: Curated luxury properties (Taj Fort Aguada, Rambagh Palace, Grand Hyatt, Radisson Blu) with ratings and pricing.
  - `CabFleetShowcase`: 4 vehicle tiers (Hatchback, Sedan, SUV, Premium SUV Innova Crysta) with transparent per-km rates.
  - `WhyChooseUs`: MakeMyTrip-benchmarked trust seals and value guarantees.
  - `Footer`: Structured multi-column travel footer with legal links, SSL badges, and admin console link.
  - `Hotel Listing (/hotels/listing)`: Faceted left filter sidebar (price range slider, star rating, user ratings, amenities) and responsive hotel cards.
  - `Hotel Details (/hotels/detail/[id])`: Photo gallery, interactive amenities grid, house policies, and room selection table.
  - `Hotel Checkout (/hotels/checkout)`: Guest details form, special requests, instant coupon calculation, and simulated Razorpay payment gateway.
  - `Hotel Confirmation (/hotels/confirmation)`: Booking voucher with ID `MMT-HTL-...`, print voucher action, and check-in timeline.
  - `Cab Listing (/cabs/listing)`: 4 cab sub-modes, route distance estimation (~240 km), vehicle comparison cards, and fare breakdown.
  - `Cab Confirmation (/cabs/confirmation)`: Cab reservation voucher with reference ID `MMT-CAB-...` and chauffeur assignment status.
  - `My Bookings Hub (/account/bookings)`: Customer reservation history with Hotels & Cabs tabs and refund cancellation action.
  - `Super Admin Dashboard (/admin/dashboard)`: Executive operations console with GMV analytics, booking volume KPIs, and live transactions ledger.
- **Frontend & Backend API Integration**:
  - `apiClient` (`web/src/lib/api-client.ts`): Type-safe REST client connecting Next.js App Router directly to the NestJS backend endpoints (`/hotels/destinations`, `/hotels/search`, `/cabs/quote`, `/bookings/hotels/initiate`, `/payments/verify`, `/bookings/:ref/cancel`).
  - Integrated checkout submission with real backend reservation initiation and payment confirmation.
- **Automated Integration Test Suite**:
  - `tests/integration-test.mjs`: Automated 9-scenario integration suite testing destination autocomplete, filtered hotel search, property overview, room rate plans, cab distance matrix, reservation initiation, payment signature verification, voucher retrieval, and cancellation refund calculation.
  - Execution result: 9/9 tests passed with 100% success rate.
- Full Next.js 16 App Router production build validated with Turbopack (17/17 static routes prerendered).
- Live local development server running on `http://localhost:3005`.
- Live NestJS API server running on `http://localhost:4000/api/v1` with Swagger at `http://localhost:4000/api/docs`.
- **Phase 4 Deliverables & Mobile Readiness (`MOB-022`)**:
  - `WriteReviewPage (/account/reviews/write)`: MakeMyTrip customer review submission form with star rating selector, cleanliness/service/location category ratings, stay type picker, and photo upload container.
  - `ReviewsModule` (`api/src/modules/reviews`): Implemented `POST /reviews/submit` and `GET /reviews/hotel/:hotelId` endpoints for verified guest reviews.
  - `CouponsModule` (`api/src/modules/coupons`): Implemented `GET /coupons/active` and `POST /coupons/verify` for instant coupon validation and calculation.
  - `InitiateCabBooking` (`api/src/modules/bookings/dto/initiate-cab-booking.dto.ts`): Backend endpoint `POST /bookings/cabs/initiate` for reserving outstation and airport cabs with driver assignment.
  - Exported machine-readable OpenAPI 3.0 specification (`api/openapi-spec.json`).
  - Authored `MOBILE_INTEGRATION_GUIDE.md` containing Flutter Dart client code, Razorpay native checkout bridges, and deep link specifications.
  - Expanded automated integration test suite (`tests/integration-test.mjs`) to 14 scenarios covering hotel, cab, payment, coupon, and review flows: **14/14 passed (100% success rate)**.
