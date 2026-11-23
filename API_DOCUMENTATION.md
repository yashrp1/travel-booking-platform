# REST API CONTRACT & OPENAPI SPECIFICATION

All REST endpoints follow standard conventions:
- Base URL: `/api/v1`
- Content-Type: `application/json`
- Authentication: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- Standard Error Format: RFC 7807 Problem Details

---

### 1. Authentication & User Endpoints
```http
POST /api/v1/auth/otp/send
Content-Type: application/json
{
  "phoneNumber": "+919876543210"
}

Response (200 OK):
{
  "success": true,
  "message": "OTP sent successfully to +919876543210",
  "requestId": "otp_req_9921a8"
}
```

```http
POST /api/v1/auth/otp/verify
Content-Type: application/json
{
  "phoneNumber": "+919876543210",
  "otp": "482910",
  "requestId": "otp_req_9921a8"
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "u_81a2f901",
    "phoneNumber": "+919876543210",
    "firstName": "Rahul",
    "role": "CUSTOMER"
  }
}
```

---

### 2. Hotel Search & Booking Endpoints
```http
GET /api/v1/hotels/destinations?query=Goa
Response (200 OK):
[
  {
    "id": "loc_goa_north",
    "name": "North Goa",
    "state": "Goa",
    "type": "CITY_AREA",
    "hotelCount": 420
  },
  {
    "id": "loc_calangute",
    "name": "Calangute Beach",
    "state": "Goa",
    "type": "LANDMARK",
    "hotelCount": 145
  }
]
```

```http
POST /api/v1/hotels/search
Content-Type: application/json
{
  "destinationId": "loc_goa_north",
  "checkInDate": "2026-11-15",
  "checkOutDate": "2026-11-18",
  "rooms": [
    { "adults": 2, "children": [6] }
  ],
  "filters": {
    "minPrice": 2000,
    "maxPrice": 12000,
    "starRatings": [4, 5],
    "userRatingMin": 4.0,
    "amenities": ["SWIMMING_POOL", "FREE_WIFI", "BREAKFAST_INCLUDED"]
  },
  "sort": "PRICE_LOW_TO_HIGH",
  "page": 1,
  "limit": 15
}

Response (200 OK):
{
  "total": 68,
  "page": 1,
  "pageSize": 15,
  "hotels": [
    {
      "id": "htl_taj_fort_aguada",
      "name": "Taj Fort Aguada Resort & Spa",
      "starRating": 5,
      "userRating": 4.8,
      "reviewCount": 1840,
      "address": "Sinquerim, Candolim, Goa",
      "distanceFromLandmark": "100m from Sinquerim Beach",
      "thumbnailUrl": "/images/hotels/taj_fort_aguada_1.webp",
      "pricePerNight": 14500,
      "strikeThroughPrice": 18000,
      "taxesAndFees": 2610,
      "freeCancellation": true,
      "cancellationDeadline": "2026-11-13T23:59:59Z",
      "tags": ["Luxury", "Beachfront", "MMT Assured"]
    }
  ]
}
```

```http
POST /api/v1/hotels/bookings/initiate
Authorization: Bearer <TOKEN>
Content-Type: application/json
{
  "hotelId": "htl_taj_fort_aguada",
  "roomTypeId": "room_deluxe_sea_facing",
  "ratePlanId": "plan_breakfast_included",
  "checkInDate": "2026-11-15",
  "checkOutDate": "2026-11-18",
  "roomsCount": 1,
  "guests": [
    { "title": "Mr", "firstName": "Rahul", "lastName": "Sharma", "age": 32 }
  ],
  "contactEmail": "rahul.sharma@example.com",
  "contactPhone": "+919876543210",
  "couponCode": "MMTWELCOME"
}

Response (201 Created):
{
  "bookingReference": "MMT-HTL-20261115-7729",
  "bookingStatus": "PAYMENT_PENDING",
  "baseFare": 43500,
  "taxes": 7830,
  "discount": 2000,
  "totalPayable": 49330,
  "razorpayOrderId": "order_RZP9812903"
}
```

---

### 3. Cab Booking Endpoints
```http
POST /api/v1/cabs/quote
Content-Type: application/json
{
  "tripType": "OUTSTATION_ONE_WAY",
  "pickupCity": "New Delhi",
  "dropCity": "Agra",
  "pickupDateTime": "2026-11-12T07:00:00Z"
}

Response (200 OK):
{
  "estimatedDistanceKm": 240,
  "estimatedDurationMinutes": 210,
  "options": [
    {
      "category": "HATCHBACK",
      "title": "Wagon R or similar",
      "seatCapacity": 4,
      "luggageCapacity": 2,
      "totalFare": 2850,
      "extraKmRate": 11.5,
      "driverAllowance": 300,
      "tollIncluded": false,
      "freeCancellationMinutes": 360
    },
    {
      "category": "SEDAN",
      "title": "Dzire, Etios or similar",
      "seatCapacity": 4,
      "luggageCapacity": 3,
      "totalFare": 3400,
      "extraKmRate": 13.0,
      "driverAllowance": 300,
      "tollIncluded": false,
      "freeCancellationMinutes": 360
    },
    {
      "category": "SUV",
      "title": "Ertiga, Marazzo or similar",
      "seatCapacity": 6,
      "luggageCapacity": 4,
      "totalFare": 4900,
      "extraKmRate": 16.0,
      "driverAllowance": 400,
      "tollIncluded": false,
      "freeCancellationMinutes": 360
    }
  ]
}
```

---

### 4. Razorpay Payment & Webhook Verification
```http
POST /api/v1/payments/verify
Authorization: Bearer <TOKEN>
Content-Type: application/json
{
  "bookingReference": "MMT-HTL-20261115-7729",
  "razorpayOrderId": "order_RZP9812903",
  "razorpayPaymentId": "pay_RZP9812903998",
  "razorpaySignature": "4a7f01c...sha256"
}

Response (200 OK):
{
  "bookingStatus": "CONFIRMED",
  "bookingReference": "MMT-HTL-20261115-7729",
  "voucherUrl": "/api/v1/hotels/bookings/MMT-HTL-20261115-7729/voucher.pdf"
}
```
