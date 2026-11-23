# BUG TRACKER & DEFECT LOG

This log tracks all identified defects, severity ratings, reproduction steps, assigned owners, and resolution states.

---

### Defect Classification Scheme
- **Critical (P0)**: System crash, data loss, booking payment discrepancy, double booking.
- **High (P1)**: Major feature broken, checkout blocked, search unavailable.
- **Medium (P2)**: UI glitch, misaligned responsive container, minor filter discrepancy.
- **Low (P3)**: Typo, non-blocking visual polish, cosmetic spacing.

---

### Defect Log Table

| Bug ID | Module | Severity | Description | Status | Discovered Date | Resolved Date | Fix Evidence |
|---|---|---|---|---|---|---|---|
| **BUG-001** | `WEB-001` | Medium (P2) | Next.js 16 dynamic date prerender hydration warning | RESOLVED | 2026-10-31 | 2026-10-31 | Replaced runtime date evaluation with deterministic dates in `Footer.tsx` and `HeroSearchContainer.tsx`. |
| **BUG-002** | `HOTEL-005` | High (P1) | `useParams()` invoked outside `<Suspense>` during static page prerendering | RESOLVED | 2026-10-31 | 2026-10-31 | Wrapped `HotelDetailContent` inside React `<Suspense>` in `web/src/app/hotels/detail/[id]/page.tsx`. |
| **BUG-003** | `BACK-019` | High (P1) | NestJS `ValidationPipe` whitelist stripping undecorated DTO properties | RESOLVED | 2026-10-31 | 2026-10-31 | Added `@IsString()`, `@IsNumber()`, `@IsOptional()` decorators across all DTOs; verified via 14/14 test pass. |

---

### Verification Protocol
Every resolved defect must include automated regression tests or browser recording confirmation before being closed.
