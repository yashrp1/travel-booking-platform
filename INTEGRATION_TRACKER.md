# INTEGRATION TRACKER

This document tracks all third-party integrations, external APIs, credentials status, mock fallbacks, and certification requirements.

> **CRITICAL ARCHITECTURAL POLICY**:
> No fabricated live availability or fake external supplier confirmations are permitted. When live production credentials are not provided, the platform seamlessly switches to dedicated, clearly labeled Mock Adapters implementing identical interface contracts.

---

### Third-Party Integrations Status Matrix

| Integration | Purpose | Provider | Status | Environment | Fallback / Mock Strategy |
|---|---|---|---|---|---|
| **Payment Gateway** | Card/UPI/NetBanking Checkout & Refunds | Razorpay | Configured / Mock Ready | Sandboxed (`rzp_test_*`) | `MockRazorpayAdapter` simulating instant QR code scanning, successful capture, and failure callbacks. |
| **Maps & Geocoding** | Autocomplete & Distance Matrix | Google Maps Platform | Configured / Mock Ready | Development | `MockMapsAdapter` with pre-computed intercity matrix (Delhi, Agra, Jaipur, Mumbai, Pune, Goa, Bengaluru, Chennai) and Harversine distance math. |
| **Transactional Email** | Booking vouchers, OTP, cancellations | Nodemailer / AWS SES | Configured / Mock Ready | Local / Ethereal | `MockEmailAdapter` writing formatted HTML vouchers to disk / console preview. |
| **SMS / Mobile OTP** | Phone number verification & trip PINs | Fast2SMS / Twilio | Configured / Mock Ready | Development | Fixed dev OTP (`482910`) when in development mode, real HTTP SMS dispatch in production. |
| **Media Storage** | Hotel & vehicle high-res images | Cloudinary / S3 | Local Curated / CDN | Development | High-quality curated royalty-free travel assets organized by property ID. |
| **Hotel Inventory Supplier** | Live supplier sync | Supplier GDS / Extranet | Mock Adapter | Simulation | `MockHotelSupplierAdapter` providing realistic hotel inventories, room rates, and revalidation responses. |
| **Cab Dispatch Partner** | Operator fleet & driver dispatch | Local Extranet Fleet DB | Native Relational Engine | Production-grade DB | Self-contained operator dispatch state machine. |

---

### Adapter Interfaces Defined

1. **`IPaymentGatewayAdapter`**:
   - `createOrder(amount: number, currency: string, receiptId: string): Promise<OrderResult>`
   - `verifySignature(orderId: string, paymentId: string, signature: string): boolean`
   - `processRefund(paymentId: string, amount: number): Promise<RefundResult>`

2. **`IMapsRoutingAdapter`**:
   - `searchPlaces(query: string): Promise<PlaceSuggestion[]>`
   - `calculateRouteDistance(pickupCoords: LatLng, dropCoords: LatLng): Promise<RouteCalculation>`

3. **`IHotelSupplierAdapter`**:
   - `checkLiveAvailability(hotelId: string, roomTypeId: string, checkIn: Date, checkOut: Date): Promise<AvailabilityResult>`
   - `confirmSupplierReservation(reservationPayload: SupplierReservationDTO): Promise<SupplierConfirmation>`
