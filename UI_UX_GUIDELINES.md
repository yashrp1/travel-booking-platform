# UI/UX GUIDELINES & MAKEMYTRIP BENCHMARK SPECIFICATION

---

### 1. Core Visual Identity & Design Tokens

The platform features an **Editorial Luxury Palette** derived from high-end boutique hospitality references, combining the intuitive booking mechanics of MakeMyTrip with warm alabaster, dusty rose taupe, rich cognac terracotta, and obsidian espresso.

#### A. Luxury Editorial Color Palette
```css
:root {
  /* 4-Color Luxury Palette Reference Tokens */
  --bg-canvas: #F7F1F0;               /* Warm Alabaster Linen / Canvas */
  --brand-accent: #C3A6A0;            /* Dusty Rose Taupe / Subdued Accent & Borders */
  --brand-primary: #A15C38;           /* Rich Terracotta / Cognac / CTA Actions */
  --brand-dark: #262220;              /* Deep Obsidian Espresso / High-Contrast Headers & Footers */

  /* Derived Warm Neutrals & Elevational Surfaces */
  --brand-primary-hover: #8C4B2A;
  --brand-primary-subtle: #F6ECE7;
  --brand-accent-light: #E8DDD9;
  --brand-accent-subtle: #FAF4F2;
  --brand-dark-surface: #1E1A19;
  --brand-dark-border: #3D3532;

  --bg-surface: #FFFFFF;
  --bg-surface-warm: #FAF6F4;
  --border-light: #E8DFDC;
  --border-warm: #DFCFCB;
  --border-focus: #A15C38;

  --text-primary: #262220;            /* Obsidian Readability */
  --text-secondary: #574E4A;          /* Warm Earth Muted Body */
  --text-muted: #877B76;              /* Footnotes & Timestamps */
  --text-accent: #A15C38;             /* Terracotta Highlight */

  /* Status Accents (Complementary Harmony) */
  --status-emerald: #4D6B53;          /* Verified / Confirmed Green */
  --status-crimson: #9B3D3D;          /* Urgency / Alert */
}
```

#### B. Typography System
- Serif Editorial Font: `'Cormorant Garamond', 'Playfair Display', Georgia, serif` (Headings, titles, hotel names)
- Sans Interface Font: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (Inputs, metadata, numbers, buttons)
- Hierarchy:
  - Hero Header: `38px / 700 bold italic Cormorant Garamond`
  - Section Titles: `28px / 600 Cormorant Garamond`
  - Hotel / Vehicle Title: `20px / 700 Cormorant Garamond`
  - Body Text: `14px / 400 Plus Jakarta Sans`
  - Captions & Meta: `12px / 500 medium`
  - Badges & Fine Print: `10px - 11px / 700 uppercase tracking-wider`

#### C. Card Elevation & Shapes
- Hero Card Elevation: `0 16px 48px rgba(38, 34, 32, 0.14)`
- Floating Widget Radius: `24px` rounded luxury cards
- Action Button: `.btn-search-gradient` (`linear-gradient(135deg, #B8724C 0%, #A15C38 55%, #8C4B2A 100%)`)
- Outline Pill: `.btn-luxury-outline` (`border: 1px solid #C3A6A0; color: #A15C38`)

---

### 2. MakeMyTrip Screen-by-Screen Interaction Patterns

#### Screen 1: Global Header & Search Hero
- **Header**:
  - Top bar with Logo, Currency (INR ₹), 24x7 Customer Support, "My Trips" (Direct link to hotel & cab bookings), and "Login / Create Account" pill button.
  - Category Switcher: Floating pill container sitting centered over the banner edge with two prominent active tabs:
    1. **Hotels** (Building icon)
    2. **Cabs** (Car icon)
- **Hero Search Card**:
  - Large elevated container on deep blue background.
  - Sub-mode radio toggles (For Hotels: "Upto 4 Rooms", "Group Bookings"; For Cabs: "Outstation One-Way", "Outstation Round-Trip", "Hourly Rental", "Airport Transfer").
  - 4-Column Grid layout with border separators:
    1. **CITY, PROPERTY OR LOCATION**: Click expands dropdown with "Recent Searches" and "Popular Cities" (Goa, Mumbai, Delhi, Bengaluru, Jaipur).
    2. **CHECK-IN**: Large day date (`15`), month/year (`Nov 2026`), and weekday (`Sunday`). Click opens dual calendar.
    3. **CHECK-OUT**: Same format, with auto-highlight of duration (e.g., `3 Nights`).
    4. **ROOMS & GUESTS**: Summary (`1 Room, 2 Adults`). Click opens stepper counter modal.
  - Centered glowing gradient CTA button: **"SEARCH"** (`background: linear-gradient(90deg, #53b2fe, #008cff)`), hovering with subtle lift.

#### Screen 2: Hotel Listing & Filter View
- **Left Sidebar**:
  - Sticky faceted filters: Price Range Slider, Star Rating Checkboxes, User Rating (4.5+, 4.0+, 3.5+), Amenities (Free Cancellation, Breakfast, Swimming Pool, Couple Friendly).
- **Listing Stream**:
  - Hotel Card format:
    - Left (35% width): Carousel of 5 high-res photos with tag badge ("Top Rated Beachfront").
    - Center (45% width): Hotel Name, Star rating stars, Location line with distance to landmarks, Verified Review badge (e.g., `4.8 / 5 Excellent - 1,840 ratings`), Amenities tags.
    - Right (20% width): Strikethrough rack rate, bold nightly price (`₹4,850`), `+ ₹582 taxes & fees`, Free Cancellation tag in green, and blue "VIEW ROOMS" button.

#### Screen 3: Hotel Details & Room Matrix
- Sticky anchor navigation bar: `Overview | Rooms | Location | Amenities | Policies | Reviews`.
- Top gallery: Grid of 5 photos (1 big hero + 4 thumb grid) with "View All 48 Photos" button.
- Room Selection Matrix:
  - Table of Room Types (Deluxe, Executive, Suite).
  - Each with Option columns: Room Only, Room with Free Breakfast, Free Cancellation.
  - Clear price delta calculator and "BOOK THIS ROOM" button that initiates checkout.

#### Screen 4: 4-Mode Cab Booking Journey
- Mode 1: **Outstation One-Way** (Pickup City, Drop City, Departure Date, Time)
- Mode 2: **Outstation Round-Trip** (Pickup City, Drop City, Departure Date, Return Date, Time)
- Mode 3: **Hourly Rental** (City, Package: 4hrs/40km, 8hrs/80km, 12hrs/120km)
- Mode 4: **Airport Transfer** (Pickup at City -> Drop at Airport OR Pickup at Airport -> Drop at City)
- Vehicle Listing Card:
  - Vehicle image (Sedan/SUV), Model names, Seating capacity, AC status, Extra km fare, Driver allowance, Inclusions tooltip, and "BOOK NOW" button.

#### Screen 5: Multi-Step Checkout & Fare Breakdown
- Left column (65% width): Guest / Passenger Details, Special Requests, GST details.
- Right column (35% width): Sticky Fare Summary card showing Itemized base price, taxes, promo code input with instant discount calculation, and Secure Payment button.
