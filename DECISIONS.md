# ARCHITECTURAL DECISION RECORDS (ADR)

This file records key architectural and business decisions made throughout the lifecycle of the project.

---

### ADR-001: Selection of MakeMyTrip as Benchmark UX/UI
- **Status**: Accepted
- **Context**: Travel booking platforms have established user expectations for search widgets, date pickers, hotel comparison cards, and cab fare structures. MakeMyTrip is the market benchmark in India.
- **Decision**: Adopt MakeMyTrip's proven booking journeys, category tab navigation (Hotels vs Cabs), floating elevated search containers, dual calendar pickers, and transparent fare breakdowns, while using our independent brand identity and clean modern web implementation.
- **Consequences**: Familiar user onboarding, high conversion design, no reinvented navigation paradigms.

---

### ADR-002: Next.js App Router for Web Frontend
- **Status**: Accepted
- **Context**: The web application requires high search engine discoverability (SEO) for hotel destinations and property pages, fast initial page loads, and seamless client-side filtering.
- **Decision**: Utilize Next.js 14+ with the App Router, React Server Components for initial static data, and client components for interactive search widgets and checkout.
- **Consequences**: Fast TTFB, automated code-splitting, modular layouts.

---

### ADR-003: NestJS Modular Monolith Architecture
- **Status**: Accepted
- **Context**: Microservices introduce distributed transaction complexity during booking and payment reconciliation at this stage. A clean modular monolith provides enterprise boundaries without overhead.
- **Decision**: Build the backend using NestJS with strict domain boundaries (`auth`, `hotels`, `cabs`, `bookings`, `payments`, `admin`).
- **Consequences**: Enables clean code reuse, unified database transactions, and simple future microservice extraction if needed.

---

### ADR-004: Anti-Double-Booking and Idempotent Payments
- **Status**: Accepted
- **Context**: Concurrent users can attempt to book the final available room, or network retries can trigger duplicate payment charges.
- **Decision**: Enforce Redis distributed locks (`redlock`) during checkout inventory hold and require `Idempotency-Key` headers on all payment and booking mutation endpoints.
- **Consequences**: Eliminates inventory overbooking and duplicate financial ledger mutations.

---

### ADR-005: Strict Separation of Mock vs Live Supplier Adapters
- **Status**: Accepted
- **Context**: In early phases or local development environments, live GDS/supplier credentials may be restricted or sandboxed.
- **Decision**: Implement dependency inversion with TypeScript adapter interfaces (`IPaymentGatewayAdapter`, `IMapsRoutingAdapter`, `IHotelSupplierAdapter`). No fake data is ever silently displayed in production.
- **Consequences**: Zero code changes when swapping sandboxed mock providers with live production APIs.

---

### ADR-006: OpenAPI Specification & Mobile Integration Readiness
- **Status**: Accepted
- **Context**: Mobile applications (Flutter/iOS/Android) must integrate seamlessly with backend reservation engines without waiting for separate mobile-only backend re-writes.
- **Decision**: Generate automated OpenAPI 3.0 specifications (`api/openapi-spec.json`) from NestJS Swagger annotations and document a unified cross-platform mobile integration blueprint (`MOBILE_INTEGRATION_GUIDE.md`).
- **Consequences**: Native and Flutter clients can auto-generate typed models and HTTP clients directly from our single source of truth.
