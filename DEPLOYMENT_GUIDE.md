# PRODUCTION DEPLOYMENT & DEVOPS GUIDE

---

### 1. Infrastructure Overview
- **Frontend**: Next.js 16 App Router containerized with Turbopack standalone output, served via Nginx edge cache.
- **Backend API**: Modular NestJS REST API with Prisma Client, Swagger interactive docs, and distributed Redlock.
- **Database**: PostgreSQL 16 with persistent storage volume and connection pooling.
- **Cache**: Redis 7 Alpine instance for session cache and distributed locks (`redlock`).
- **Edge Reverse Proxy**: Nginx Alpine with gzip compression, security headers (`X-Frame-Options`, `nosniff`), and SSL termination.

---

### 2. One-Command Production Launch (Docker Compose)

The repository includes a ready-to-deploy [`docker-compose.yml`](file:///Users/indigi/.gemini/antigravity-ide/scratch/travel-booking-platform/docker-compose.yml):

```bash
# 1. Clone & Enter project root
cd travel-booking-platform

# 2. Configure production environment files
cp api/.env.example api/.env
cp web/.env.example web/.env

# 3. Build and launch all 5 services in detached mode
docker compose up --build -d

# 4. Check cluster status
docker compose ps
```

The orchestration automatically spins up:
1. `wanderstay_postgres`: PostgreSQL on port 5432 with health check.
2. `wanderstay_redis`: Redis on port 6379 with health check.
3. `wanderstay_api`: NestJS API on port 4000 (applies Prisma migrations on startup).
4. `wanderstay_web`: Next.js frontend on port 3000.
5. `wanderstay_nginx`: Reverse proxy on port 80 routing `/api` to NestJS and `/` to Next.js.

---

### 3. Database Migration & Seeding

To run migrations and seed sample hotels, rooms, cabs, and coupons into PostgreSQL:

```bash
cd travel-booking-platform/api

# Run pending migrations against PostgreSQL
npx prisma migrate deploy

# Execute the master seed script
npx ts-node prisma/seed.ts
```

---

### 4. Production Environment Configuration

#### Backend Variables (`api/.env`)
```env
PORT=4000
NODE_ENV=production
DATABASE_URL="postgresql://postgres:password123@postgres:5432/wanderstay?schema=public"
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET="wanderstay_production_jwt_secret_key_8921"
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"
GOOGLE_MAPS_API_KEY="AIzaSyxxxxxxxxxxxx"
```

#### Frontend Variables (`web/.env`)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
NEXT_PUBLIC_GOOGLE_MAPS_KEY="AIzaSyxxxxxxxxxxxx"
```

---

### 5. Automated Verification & Health Checks

Run the automated integration test suite against the deployed environment:

```bash
node tests/integration-test.mjs
```

Expected output:
```
✓ PASS: HOTEL: Destination Autocomplete
✓ PASS: HOTEL: Search with Filters
✓ PASS: HOTEL: Get Property Overview
✓ PASS: HOTEL: Room Rate Plans
✓ PASS: CAB: Distance Matrix & Fare Calculation
✓ PASS: HOTEL: Initiate Reservation & Order
✓ PASS: PAYMENT: Verify Signature & Issue Voucher
✓ PASS: BOOKING: Retrieve Confirmed Voucher
✓ PASS: BOOKING: Cancellation & Automated Refund
✓ PASS: CAB: Initiate Reservation & Driver Allocation
✓ PASS: COUPON: Get Active Offers
✓ PASS: COUPON: Verify Code & Calculate Discount
✓ PASS: REVIEW: Submit Verified Stay Rating
✓ PASS: REVIEW: Retrieve Property Reviews & Average
====================================================
ALL TESTS PASSED ✓ (14/14)
```
