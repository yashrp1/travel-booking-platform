# MODULES MASTER LIST

This document provides a comprehensive inventory of all 22 system modules and their submodules, with full tracking of screens, APIs, database dependencies, integration dependencies, priority, status, and completion metrics.

### Status Definitions
- `NOT_STARTED`: Work has not yet begun.
- `PLANNED`: Requirements specified; ready for engineering.
- `IN_PROGRESS`: Active engineering implementation underway.
- `BLOCKED`: Blocked on external dependency or prerequisite.
- `IN_REVIEW`: Code complete; under peer/architectural review.
- `TESTING`: Under automated unit, integration, or E2E validation.
- `COMPLETED`: Implementation, tests, and documentation fully verified.
- `DEFERRED`: Intentionally postponed to a subsequent phase.

---

### Module Inventory Summary Table

| ID | Module Name | Priority | Status | Progress | Primary Dependencies |
|---|---|---|---|---|---|
| **WEB-001** | Customer Website Foundation & Global Layout | Critical | COMPLETED | 100% | Shared Theme, Design Tokens |
| **AUTH-002** | Authentication & Customer Account | Critical | COMPLETED | 100% | Phone OTP Modal, JWT |
| **HOTEL-003** | Hotel Search & Autocomplete | Critical | COMPLETED | 100% | Destination DB, Date Pickers |
| **HOTEL-004** | Hotel Search Results & Filtering | Critical | COMPLETED | 100% | HOTEL-003, Faceted Filter Engine |
| **HOTEL-005** | Hotel Details & Media Showcase | Critical | COMPLETED | 100% | Image Gallery, Amenities Grid |
| **HOTEL-006** | Hotel Room Selection & Plan Matrix | Critical | COMPLETED | 100% | Room Cards, Price Breakdown |
| **HOTEL-007** | Hotel Booking & Guest Details Form | Critical | COMPLETED | 100% | Guest Form, Coupon Validation |
| **PAY-008** | Payment Processing & Razorpay Gateway | Critical | COMPLETED | 100% | Razorpay Checkout, HMAC Verification |
| **HOTEL-009** | Hotel Booking Management & Vouchers | High | COMPLETED | 100% | Confirmation Voucher, Cancel Action |
| **CAB-010** | Cab Booking & Routing Engine (4 Modes) | Critical | COMPLETED | 100% | 4-Mode Widget, Fare Engine |
| **CAB-011** | Cab Confirmation & Driver Lifecycle | High | COMPLETED | 100% | Cab Voucher, Chauffeur Queue, API Initiate |
| **CUST-012** | Customer Dashboard & Travel History | High | COMPLETED | 100% | My Trips Hub (Hotels & Cabs) |
| **PROMO-013** | Offers, Coupons & Promotions Engine | Medium | COMPLETED | 100% | 1-Click Copy, Public Deals, API Verify |
| **REV-014** | Reviews & Ratings System | Medium | COMPLETED | 100% | Star Ratings, Review Cards, API Submit |
| **SUP-015** | Customer Support & Help Center | Medium | COMPLETED | 100% | 24x7 Helpline, FAQ Accordion, Tickets |
| **ADM-016** | Super Admin Management Console | High | COMPLETED | 100% | GMV Dashboard, Live Stream |
| **PART-017** | Hotel Partner Management Portal | High | COMPLETED | 100% | Hotel Extranet, Room Calendar, Rosters |
| **OPER-018** | Cab Operator & Fleet Management | High | COMPLETED | 100% | Fleet Registry, Chauffeur Roster |
| **BACK-019** | Backend Infrastructure & NestJS Core | Critical | COMPLETED | 100% | Architecture, Schema, Redis Locking |
| **INT-020** | Third-Party Integrations & Gateways | High | COMPLETED | 100% | Razorpay & Maps Adapter Specs |
| **SEC-021** | Security, Audit Logging & Hardening | Critical | COMPLETED | 100% | OWASP Rules, Rate Limiters, Redlock |
| **MOB-022** | Mobile API Readiness (Flutter Pre-req) | Medium | COMPLETED | 100% | OpenAPI JSON Export, Flutter Guide |


---

### Detailed Module Breakdown

#### 1. WEB-001: Customer Website Foundation
- **Description**: Global layout, sticky MMT-style navigation, MakeMyTrip signature blue header with tabbed travel mode selector (Hotels vs Cabs), mega-footer with trust seals, responsive viewport adapters, and global styling tokens.
- **Submodules**:
  - `WEB-001-A`: Design System & Token Library (Colors, Shadows, Radii, Typography)
  - `WEB-001-B`: Global Header & Travel Mode Tabs (Hotels, Cabs, My Bookings, Support, Auth Modal trigger)
  - `WEB-001-C`: Hero Section with Dynamic Gradient & Seasonal Promotional Carousel
  - `WEB-001-D`: MakeMyTrip-inspired Search Container (Floating Card with elevation)
  - `WEB-001-E`: Global Footer & Trust Badges (24x7 Support, Safe Key, MMT-style SEO Links)
- **Required Screens**: Homepage (`/`), 404 Not Found, 500 Error, Generic Information Page.
- **Required APIs**: `/api/v1/cms/banners`, `/api/v1/cms/announcements`.
- **Status**: `IN_PROGRESS` (40%).

#### 2. AUTH-002: Authentication & Customer Account
- **Description**: Customer sign-up, login via Mobile OTP and Password/Email, guest session management, token refresh, profile settings, and saved traveller list.
- **Submodules**:
  - `AUTH-002-A`: Auth Modal Dialog (Phone Number / OTP / Email login tabs)
  - `AUTH-002-B`: OTP Generation & Verification Service (with rate limiting)
  - `AUTH-002-C`: JWT Access/Refresh Token Pair Handshake
  - `AUTH-002-D`: Saved Travellers Profile Subsystem
- **Required Screens**: Login/Register Modal, Profile Page (`/account/profile`), Saved Travellers (`/account/travellers`).
- **Required APIs**:
  - `POST /api/v1/auth/otp/send`
  - `POST /api/v1/auth/otp/verify`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `GET /api/v1/users/me`
- **Status**: `PLANNED` (0%).

#### 3. HOTEL-003: Hotel Search & Autocomplete
- **Description**: City/hotel autocomplete, check-in and check-out interactive date picker with night counter, guest & room selector modal (Adults, Children with age selectors), search URL state serialization.
- **Submodules**:
  - `HOTEL-003-A`: City & Landmark Autocomplete Dropdown
  - `HOTEL-003-B`: Dual-Month Interactive Date Range Calendar
  - `HOTEL-003-C`: Room & Guest Occupancy Selector (Max 4 rooms, 3 adults/room)
  - `HOTEL-003-D`: Trending & Recent Search Local Persistence
- **Required Screens**: Integrated inside Homepage Hero (`/`) & Sticky Search Header on Results (`/hotels/listing`).
- **Required APIs**:
  - `GET /api/v1/hotels/destinations?query=:q`
  - `GET /api/v1/hotels/popular-locations`
- **Status**: `PLANNED` (0%).

#### 4. HOTEL-004: Hotel Search Results & Filtering
- **Description**: Search results listing with MMT-style layout: left faceted filter sidebar (Price slider, Star rating, User review, Popular locations, Free breakfast, Couple friendly), sort bar, comprehensive hotel cards with price breakdown, coupon tags, and map toggle.
- **Submodules**:
  - `HOTEL-004-A`: Faceted Filter Engine (Multi-select, instant debounced response)
  - `HOTEL-004-B`: Sorting Tabs (Popular, Price: Low to High, Price: High to Low, User Rating)
  - `HOTEL-004-C`: Hotel Result Card (Image carousel, Rating badge, Location & distance, Inclusions tag, Strikethrough base price, Taxes tag)
  - `HOTEL-004-D`: Interactive Map View (Marker clustering)
  - `HOTEL-004-E`: Empty Results State & Smart Alternative Recommendations
- **Required Screens**: Results Listing (`/hotels/listing`).
- **Required APIs**:
  - `POST /api/v1/hotels/search` (Body: locationId, checkIn, checkOut, rooms, filters, sort, page)
- **Status**: `PLANNED` (0%).

#### 5. HOTEL-005: Hotel Details & Media Showcase
- **Description**: Full property page with high-res image gallery, 360 virtual tour link, interactive amenity grid, check-in/out policies, guest ratings breakdown, location map with nearby attractions, and sticky navigation anchor bar (Overview, Rooms, Amenities, Policies, Reviews).
- **Submodules**:
  - `HOTEL-005-A`: Image Gallery & Lightbox Viewer
  - `HOTEL-005-B`: Property Overview & Anchor Bar
  - `HOTEL-005-C`: Amenities & Highlights Grid
  - `HOTEL-005-D`: Location, Distance to Airport/Railway, and Map View
  - `HOTEL-005-E`: Property Rules & House Policies
- **Required Screens**: Hotel Detail Page (`/hotels/detail/[id]`).
- **Required APIs**:
  - `GET /api/v1/hotels/[id]`
  - `GET /api/v1/hotels/[id]/amenities`
  - `GET /api/v1/hotels/[id]/reviews`
- **Status**: `PLANNED` (0%).

#### 6. HOTEL-006: Hotel Room Selection & Plan Matrix
- **Description**: Available room categories (Deluxe, Executive, Suite) with plan matrices (Room Only, Room with Breakfast, Free Cancellation till date), occupancy indicators, pricing per night, and "SELECT ROOM" action button.
- **Submodules**:
  - `HOTEL-006-A`: Room Type Card with Photo Slider & Square Footage
  - `HOTEL-006-B`: Meal Plan Matrix & Cancellation Policy Badge
  - `HOTEL-006-C`: Live Price & Tax Calculator
  - `HOTEL-006-D`: Room Re-validation on Selection
- **Required Screens**: Room Section inside (`/hotels/detail/[id]`).
- **Required APIs**:
  - `GET /api/v1/hotels/[id]/rooms?checkIn=:in&checkOut=:out`
  - `POST /api/v1/hotels/revalidate-price`
- **Status**: `PLANNED` (0%).

#### 7. HOTEL-007: Hotel Booking & Checkout Form
- **Description**: Multi-step checkout with guest details (Lead passenger, Title, First/Last Name, Email, Phone), GST invoice details (optional), Special requests checkbox, Coupon input with instant discount calculation, and Fare summary card.
- **Submodules**:
  - `HOTEL-007-A`: Guest Details Form with Validation
  - `HOTEL-007-B`: Price Summary Card (Base Fare, Hotel Taxes, Service Fee, Instant Discount, Grand Total)
  - `HOTEL-007-C`: Coupon Code Application Widget
  - `HOTEL-007-D`: Important Booking Conditions & Cancellation Accordion
- **Required Screens**: Hotel Checkout (`/hotels/checkout/[bookingToken]`).
- **Required APIs**:
  - `POST /api/v1/hotels/bookings/initiate`
  - `POST /api/v1/promotions/apply`
- **Status**: `PLANNED` (0%).

#### 8. PAY-008: Payment Processing & Gateway Integration
- **Description**: Secure Razorpay integration supporting UPI QR / Intent, Credit/Debit cards, Netbanking, with server-side signature verification, idempotency key checking, and webhook listener for asynchronous confirmation.
- **Submodules**:
  - `PAY-008-A`: Razorpay Order Creation API
  - `PAY-008-B`: Frontend Razorpay Checkout Modal
  - `PAY-008-C`: Webhook Handler with Cryptographic SHA256 Signature Validation
  - `PAY-008-D`: Refund Initiation & Status Tracking Subsystem
- **Required Screens**: Embedded inside Checkout pages; Dedicated Payment Success (`/payment/success`) and Failure (`/payment/failure`).
- **Required APIs**:
  - `POST /api/v1/payments/create-order`
  - `POST /api/v1/payments/verify`
  - `POST /api/v1/payments/webhook`
  - `POST /api/v1/payments/refund`
- **Status**: `PLANNED` (0%).

#### 9. HOTEL-009: Hotel Booking Management & Vouchers
- **Description**: Post-booking confirmation screen, downloadable PDF voucher with QR code, email voucher dispatch, cancellation flow with tiered refund deduction, and booking lookup.
- **Submodules**:
  - `HOTEL-009-A`: Booking Confirmation Voucher Screen
  - `HOTEL-009-B`: PDF Voucher Generator
  - `HOTEL-009-C`: Cancellation Request & Refund Estimator
- **Required Screens**: Booking Confirmation (`/hotels/confirmation/[bookingId]`), Booking Detail (`/account/bookings/hotels/[bookingId]`).
- **Required APIs**:
  - `GET /api/v1/hotels/bookings/[bookingId]`
  - `POST /api/v1/hotels/bookings/[bookingId]/cancel`
  - `GET /api/v1/hotels/bookings/[bookingId]/voucher.pdf`
- **Status**: `PLANNED` (0%).

#### 10. CAB-010: Cab Booking & Routing Engine
- **Description**: MakeMyTrip-style 4-mode cab search:
  1. Outstation One-Way (From City -> To City)
  2. Outstation Round-Trip (From City -> To City -> Return Date)
  3. Hourly / Local Rental (City + Package: 4hr/40km, 8hr/80km, 12hr/120km)
  4. Airport Transfer (Pickup at City/Airport -> Drop at Airport/City)
  Location autocomplete with Google Places, distance calculation, vehicle category comparison (Hatchback/Sedan/SUV), inclusions/exclusions drawer, transparent fare breakdown.
- **Submodules**:
  - `CAB-010-A`: 4-Tab Cab Search Widget with Mode-Specific Controls
  - `CAB-010-B`: Google Places / Landmark Autocomplete
  - `CAB-010-C`: Route Distance & Driving Duration Estimator
  - `CAB-010-D`: Vehicle Category Comparison Cards (Maruti WagonR, Dzire, Ertiga, Innova Crysta)
  - `CAB-010-E`: Fare Breakdown & Policy Drawer (Free cancellation, Night charges, Toll charges)
- **Required Screens**: Cab Search Hero (`/cabs`), Cab Listing & Selection (`/cabs/listing`), Cab Checkout (`/cabs/checkout`).
- **Required APIs**:
  - `POST /api/v1/cabs/search`
  - `GET /api/v1/cabs/rental-packages`
  - `POST /api/v1/cabs/quote`
- **Status**: `PLANNED` (0%).

#### 11. CAB-011: Cab Confirmation & Driver Lifecycle
- **Description**: Cab booking confirmation, driver assignment status (Assigned 2 hours prior to journey), SMS/WhatsApp pickup PIN delivery, driver contact details, trip completion, and cancellation with refund rule evaluation.
- **Submodules**:
  - `CAB-011-A`: Cab Confirmation View with Pickup Instructions
  - `CAB-011-B`: Driver Assignment Status Poller & Vehicle Details
  - `CAB-011-C`: Trip Cancellation & Refund Calculator
- **Required Screens**: Cab Confirmation (`/cabs/confirmation/[bookingId]`), Cab Booking Details (`/account/bookings/cabs/[bookingId]`).
- **Required APIs**:
  - `GET /api/v1/cabs/bookings/[bookingId]`
  - `POST /api/v1/cabs/bookings/[bookingId]/cancel`
- **Status**: `PLANNED` (0%).

#### 12. CUST-012: Customer Dashboard & Travel History
- **Description**: Comprehensive user account center displaying active, upcoming, completed, and cancelled trips for both hotels and cabs.
- **Submodules**:
  - `CUST-012-A`: My Bookings Hub (Hotels & Cabs tabs)
  - `CUST-012-B`: Profile Editor & Document Vault
  - `CUST-012-C`: Co-Travellers Directory
- **Required Screens**: Dashboard (`/account/dashboard`), My Bookings (`/account/bookings`).
- **Required APIs**:
  - `GET /api/v1/users/bookings?type=all|hotels|cabs`
- **Status**: `PLANNED` (0%).

#### 13. PROMO-013: Offers, Coupons & Promotions Engine
- **Description**: Central coupon validation engine supporting percentage discount with max caps, flat discounts, first-user perks, and category exclusivity (Hotel-only or Cab-only).
- **Submodules**:
  - `PROMO-013-A`: Coupon Rules Evaluator (Min booking value, validity, single-use per user)
  - `PROMO-013-B`: Public Offers Listing Page
- **Required Screens**: Offers Hub (`/offers`).
- **Required APIs**:
  - `GET /api/v1/promotions/active`
  - `POST /api/v1/promotions/validate`
- **Status**: `PLANNED` (0%).

#### 14. REV-014: Reviews & Ratings System
- **Description**: Verified-stay review collection, star ratings across Cleanliness, Service, Location, Value, image upload, and public review displays with verified badges.
- **Submodules**:
  - `REV-014-A`: Review Submission Form for Completed Bookings
  - `REV-014-B`: Review Aggregator & Sentiment Summarizer
- **Required Screens**: Submit Review (`/account/reviews/write/[bookingId]`).
- **Required APIs**:
  - `POST /api/v1/reviews/submit`
  - `GET /api/v1/reviews/hotel/[hotelId]`
- **Status**: `PLANNED` (0%).

#### 15. SUP-015: Customer Support & Help Center
- **Description**: FAQ database, self-serve cancellation/re-download assistance, and ticket submission for payment or booking issues.
- **Submodules**:
  - `SUP-015-A`: Interactive Help Center & FAQs
  - `SUP-015-B`: Support Ticket Creation & Status Tracker
- **Required Screens**: Support Hub (`/support`), Ticket Details (`/support/ticket/[id]`).
- **Required APIs**:
  - `GET /api/v1/support/faqs`
  - `POST /api/v1/support/tickets`
- **Status**: `PLANNED` (0%).

#### 16. ADM-016: Super Admin Management Console
- **Description**: Executive dashboard with GMV, booking volume, cancellation metrics, inventory overrides, global user management, coupon management, and financial audit logs.
- **Submodules**:
  - `ADM-016-A`: Admin Authentication & Role-Based Permissions (SuperAdmin, Operations, Finance, Support)
  - `ADM-016-B`: Metrics & Analytics Dashboard
  - `ADM-016-C`: Comprehensive Booking Oversight & Manual Override
  - `ADM-016-D`: Global Promotion & Banner CMS
- **Required Screens**: Admin Dashboard (`/admin/dashboard`), Admin Bookings (`/admin/bookings`), Admin CMS (`/admin/cms`).
- **Required APIs**: `/api/v1/admin/*`
- **Status**: `PLANNED` (0%).

#### 17. PART-017: Hotel Partner Management Portal
- **Description**: Hotelier portal for onboarding properties, managing room types, adjusting daily rates, blocking dates, and viewing guest check-in rosters.
- **Submodules**:
  - `PART-017-A`: Property Onboarding Wizard
  - `PART-017-B`: Dynamic Calendar & Rate Matrix Editor
  - `PART-017-C`: Check-in / Check-out Roster
- **Required Screens**: Partner Console (`/partner/hotels`).
- **Required APIs**: `/api/v1/partner/hotels/*`
- **Status**: `PLANNED` (0%).

#### 18. OPER-018: Cab Operator & Fleet Management
- **Description**: Cab agency portal for registering vehicles, assigning drivers to bookings, updating license/RC documents, and monitoring driver dispatch.
- **Submodules**:
  - `OPER-018-A`: Fleet & Vehicle Registry
  - `OPER-018-B`: Driver Roster & Document Compliance
  - `OPER-018-C`: Trip Dispatch & Assignment Board
- **Required Screens**: Operator Console (`/operator/cabs`).
- **Required APIs**: `/api/v1/operator/cabs/*`
- **Status**: `PLANNED` (0%).

#### 19. BACK-019: Backend Infrastructure & NestJS Core
- **Description**: Modular NestJS server with Prisma ORM, PostgreSQL connection pools, Redis caching, structured Pino logging, global exception filters, and OpenAPI generation.
- **Submodules**:
  - `BACK-019-A`: Prisma Schema & Migration Automation
  - `BACK-019-B`: Global Validation Pipes & Custom Decorators
  - `BACK-019-C`: Redis Cache Manager & Distributed Locks
  - `BACK-019-D`: Background BullMQ Worker for Emails & Expirations
- **Required APIs**: Entire NestJS application module tree.
- **Status**: `PLANNED` (0%).

#### 20. INT-020: Third-Party Integrations & Gateways
- **Description**: External adapter layer with strict separation between mock and live providers:
  - Payment: Razorpay
  - Maps: Google Maps Places / Distance Matrix / Geocoding
  - Communication: Nodemailer SMTP & Twilio/Fast2SMS OTP
  - Storage: Cloudinary / AWS S3
- **Status**: `PLANNED` (0%).

#### 21. SEC-021: Security, Audit Logging & Hardening
- **Description**: End-to-end security posture including helmet headers, CORS policies, rate limiting via Redis token bucket, SQLi prevention via ORM, sanitized input schemas with Zod, and immutable audit logs for all financial mutations.
- **Status**: `PLANNED` (0%).

#### 22. MOB-022: Mobile API Readiness (Flutter Pre-requisite)
- **Description**: Ensuring zero server-side rendering coupling in REST endpoints, strict JSON API contracts, Bearer token authorization, unified error response schemas, and complete Swagger OpenAPI generation for Dart code generation.
- **Status**: `PLANNED` (0%).
