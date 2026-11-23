# MOBILE INTEGRATION & SDK READINESS GUIDE (`MOB-022`)

## 1. Executive Summary
This guide specifies the contracts, serialization standards, authentication flows, and integration blueprints for native mobile applications (iOS, Android) and cross-platform frameworks (Flutter, React Native) integrating with the **WanderStay Travel Booking Platform**.

The complete machine-readable OpenAPI 3.0 specification is available at:
`travel-booking-platform/api/openapi-spec.json`
Interactive Swagger UI is accessible at `http://localhost:4000/api/docs`.

---

## 2. API Architecture & Standards

- **Base URL (Local/Staging):** `http://localhost:4000/api/v1`
- **Protocol:** HTTP/2 over TLS 1.3 in production
- **Format:** Strict JSON (`Content-Type: application/json; charset=utf-8`)
- **Authentication:** Bearer JWT in the `Authorization` header (`Authorization: Bearer <token>`)
- **Idempotency:** Include `X-Idempotency-Key: <UUIDv4>` on all mutating endpoints (`/bookings/hotels/initiate`, `/bookings/cabs/initiate`)

---

## 3. Core Mobile Endpoints Reference

### 3.1 Hotel Discovery & Booking Flow
| Step | Method | Path | Description |
|---|---|---|---|
| 1 | `GET` | `/hotels/destinations?query={city}` | Autocomplete search for destinations |
| 2 | `POST` | `/hotels/search` | Search hotels with star rating, price & guest filters |
| 3 | `GET` | `/hotels/{id}` | Detailed property overview, image gallery, policies |
| 4 | `GET` | `/hotels/{id}/rooms` | Room types, meal plan matrix (EP/CP/MAP), inclusions |
| 5 | `POST` | `/coupons/verify` | Verify promo codes (`MMTWELCOME`, `SUPERSTAY`) |
| 6 | `POST` | `/bookings/hotels/initiate` | Lock inventory & generate Razorpay `order_id` |
| 7 | `POST` | `/payments/verify` | Submit Razorpay payment signature & confirm voucher |
| 8 | `GET` | `/bookings/{reference}` | Retrieve voucher details and QR code data |

### 3.2 Cab Booking Flow
| Step | Method | Path | Description |
|---|---|---|---|
| 1 | `POST` | `/cabs/quote` | Calculate road distance, travel duration, vehicle tiers |
| 2 | `POST` | `/coupons/verify` | Apply promo discount (`CABRUSH`, `AIRPORTFAST`) |
| 3 | `POST` | `/bookings/cabs/initiate` | Book cab, reserve vehicle, allocate chauffeur |
| 4 | `GET` | `/bookings/{reference}` | Real-time driver location and trip dispatch tracker |
| 5 | `POST` | `/bookings/{reference}/cancel` | Instant cancellation with automated refund check |

---

## 4. Flutter Integration Code Blueprint

### 4.1 Hotel Search Client (Dart)
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class HotelApiClient {
  static const String baseUrl = 'http://localhost:4000/api/v1';

  static Future<List<Map<String, dynamic>>> searchHotels({
    required String destination,
    required String checkInDate,
    required String checkOutDate,
    List<int>? starRatings,
    double? maxPrice,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/hotels/search'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'destination': destination,
        'checkInDate': checkInDate,
        'checkOutDate': checkOutDate,
        'starRatings': starRatings ?? [4, 5],
        'maxPrice': maxPrice ?? 50000,
      }),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['hotels']);
    } else {
      throw Exception('Failed to search hotels: ${response.body}');
    }
  }
}
```

### 4.2 Razorpay Payment Modal Integration (Dart)
```dart
import 'package:razorpay_flutter/razorpay_flutter.dart';

void openRazorpayCheckout({
  required String orderId,
  required double amountInRupees,
  required String bookingRef,
  required String userEmail,
  required String userPhone,
}) {
  Razorpay _razorpay = Razorpay();

  _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, (PaymentSuccessResponse res) async {
    // Send payment details to backend
    await http.post(
      Uri.parse('http://localhost:4000/api/v1/payments/verify'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'bookingReference': bookingRef,
        'razorpayOrderId': res.orderId,
        'razorpayPaymentId': res.paymentId,
        'razorpaySignature': res.signature,
      }),
    );
  });

  var options = {
    'key': 'rzp_test_placeholder',
    'amount': (amountInRupees * 100).toInt(),
    'name': 'WanderStay Travel',
    'description': 'Booking Ref: $bookingRef',
    'order_id': orderId,
    'prefill': {'contact': userPhone, 'email': userEmail},
    'theme': {'color': '#008cff'}
  };

  _razorpay.open(options);
}
```

---

## 5. Offline Caching & Deep Linking Strategy
1. **Push Notifications:** Webhook callbacks from Razorpay trigger Firebase Cloud Messaging (FCM) notifications on driver assignment and booking confirmation.
2. **Deep Links:** 
   - `wanderstay://hotels/detail/{id}`
   - `wanderstay://trips/voucher/{reference}`
   - `wanderstay://cabs/track/{reference}`
3. **Offline Voucher Vault:** Cache confirmed booking vouchers locally using SQLite / Realm so travellers can access hotel address and driver contacts without active mobile data.
