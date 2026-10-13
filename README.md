# DRIVEVAULT — World-Class Car Rental & Booking Platform

> **"Premium Cars. Seamless Journeys."**

DRIVEVAULT is an ultra-premium, production-grade automotive rental and reservation web platform. Crafted with a luxury automotive aesthetic, modern glassmorphism, responsive architecture, and smooth micro-interactions, DRIVEVAULT delivers a high-end experience worthy of international exotic car rental startups.

---

## 🚀 Instant Zero-Setup Launch

**No installations, no npm packages, and no server commands required!**

All files are placed directly in the root directory without subfolders:
- Double-click [`index.html`](file:///f:/DAy%202%20projects/Car%20Rental%20&%20Booking%20Platform/index.html) or open it directly in any modern web browser (Chrome, Edge, Safari, Firefox).
- Every feature operates out of the box with reactive state management and `localStorage` persistence.

---

## 📁 Root File Architecture

```
Car Rental & Booking Platform/
├── index.html     # Semantic markup, hero search, fleet catalog, 6 modals & views
├── style.css      # Luxury dark/light design system, glassmorphism, print receipt styles
├── data.js        # Comprehensive fleet database, international hubs, offers & FAQs
├── app.js         # Reactive state engine, multi-step booking wizard, live price calculator, CRUD
└── README.md      # Documentation & feature guide
```

---

## ✨ Key Features & Interactive Capabilities

### 1. Sticky Glass Navigation
- **Dynamic Navbar**: Transparent over the hero section, transitioning to a frosted glass blur with subtle border glow upon scrolling.
- **Dark / Light Mode**: Seamlessly switch between *Midnight Navy* (`#07111F`) and *Executive Daylight* mode with instant persistence in `localStorage`.
- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant search overlay to rapidly query any car, model, or city hub.
- **Quick Comparison Badge & Drawer**: Tracks up to 3 selected vehicles with instant access to side-by-side specs.
- **Notification Dropdown**: Live notifications for seasonal discounts and fleet additions.

### 2. Cinematic Hero & Booking Search Bar
- **Automotive Visuals**: Showcases the 2024 Porsche 911 GT3 RS with floating telemetry badges (`0-60 in 3.0s`, `Available`, `$850/day`).
- **Interactive Booking Panel**: Real-time pick-up and drop-off selectors, date & time pickers, and location swap button.

### 3. Trust & Key Performance Bar
- **Animated Metrics**: 10K+ Happy Customers, 250+ Premium Vehicles, 35+ Global Locations, 4.9/5 Rating.
- **Trust Badges**: 100% Verified Fleet, 24/7 Concierge Support, Flexible Cancellation, Zero Hidden Fees.

### 4. Fleet Catalog & Multi-Facet Filters
- **Category Tabs**: *All, Sports, Luxury, SUV, Sedan, Electric*.
- **Live Search**: Instant keyword filtering across brand, model, engine type, or assigned city.
- **Interactive Range Slider**: Filter vehicles up to $1,500/day with real-time value preview.
- **Telemetry Filters**: Transmission (Automatic, Dual-Clutch), Seating Capacity (2, 4, 5+ persons), and Sort Orders (Price Low/High, Rating, Popularity, Featured).
- **Vehicle Cards**: Image zoom on hover, spec pills, daily rates, favorite toggle (heart), compare checkbox, and direct "Book" / "Details" actions.

### 5. Vehicle Details Modal
- **High-Res Photo Gallery**: Interactive thumbnail strip that dynamically updates the main showcase image.
- **Performance Telemetry**: Horsepower, 0-60 mph, top speed, transmission, drivetrain, luggage capacity, and fuel economy.
- **Rental Tier Pricing**: Daily, Weekly (-15%), and Monthly (-30%) rate cards.
- **Features Checklist**: GPS Navigation, Bose/Burmester 3D Sound, Active Aero, Ceramic Brakes, Apple CarPlay.
- **Direct Reservation CTA**: Pre-loads the selected car into Step 1 of the booking wizard.

### 6. Side-by-Side Comparison Matrix
- Compare up to 3 vehicles concurrently.
- Side-by-side comparison table covering power, acceleration, top speed, transmission, drive type, seats, and daily rates.
- Remove individual vehicles or reserve directly from the comparison view.

### 7. 6-Step Booking Wizard with Real-Time Price Calculator
1. **Step 1 — Vehicle**: Confirm or switch your selected vehicle.
2. **Step 2 — Itinerary**: Configure pick-up & drop-off locations, dates, times, and review auto-calculated duration.
3. **Step 3 — Extras & Protection**:
   - Optional Add-ons: Additional Driver ($18/d), GPS Radar Alert ($12/d), Child Seat ($15/d), Starlink Wi-Fi ($14/d), 24/7 Roadside Assistance ($20/d).
   - Protection Tiers: Standard Protection ($0/d), Premium Shield ($45/d), VIP Concierge Shield ($85/d).
4. **Step 4 — Driver Details**: Name, email, phone, and driver license number with validation.
5. **Step 5 — Summary & Live Calculator**:
   - Itemized real-time breakdown: `Base Rental` + `Add-ons` + `Protection Tier` + `6% Concierge Fee` - `Promo Discount`.
   - Working Promo Codes:
     - `WEEKEND20`: 20% discount.
     - `LUXURY150`: $150 direct credit.
     - `LONGDRIVE30`: 30% discount on rentals of 7+ days.
6. **Step 6 — Reservation Confirmed**:
   - Unique reference ID (e.g. `DV-BOK-49120`).
   - Printable luxury receipt formatted via `@media print` for saving as PDF or printing.
   - Automatically saved to `localStorage` for viewing in the customer dashboard.

### 8. Customer User Dashboard
- **Telemetry Cards**: Active/Upcoming Trips, Total Trips, Saved Vehicles, Total Spent.
- **My Bookings Tab**: View upcoming, active, and completed journeys with real "Cancel Reservation" action (with confirmation dialog) and printable receipts.
- **Favorite Cars Tab**: Access your private saved garage with quick booking buttons.
- **Profile & Security Tab**: Update legal name, phone, and license details with persistent state.

### 9. Admin Operations & Fleet Portal
- **Executive KPI Cards**: Total Revenue ($148K+), Total Bookings, Active Fleet Count, 92% Fleet Utilization.
- **Fleet Management Table**: View full vehicle inventory, toggle vehicle availability ("Available" / "Reserved"), delete vehicles with confirmation, or launch the **Add Vehicle Modal** to publish new cars into the fleet.
- **Live Reservations Table**: Update booking statuses live (`Upcoming`, `Active`, `Completed`, `Cancelled`).
- **Revenue Analytics**: Visual monthly bar charts and category distribution metrics.

### 10. Global Locations & Interactive Map
- 8 international flagship delivery hubs (Beverly Hills, Manhattan NYC, Miami Beach, Dubai Marina, London Mayfair, Zurich Airport, Paris Champs-Élysées, Munich Center).
- Interactive stylized world contour map with clickable pulsing airport/hub pinpoints that filter the fleet by city.

### 11. Special Offers & Promos
- Promotional cards with "Copy Code" to clipboard and "Apply to Reservation" buttons that directly activate the promo code in the booking wizard.

### 12. Client Testimonials & FAQ
- **Customer Reviews Carousel**: Interactive slides with star ratings, reviewer avatars, and rented vehicle context.
- **Expandable FAQ Accordion**: Smooth animated expand/collapse for common rental, deposit, and insurance questions.

### 13. Concierge Contact Form & Toast Notifications
- Contact form with client-side validation, error alerts, and success toasts.
- Toast notification system providing instant feedback for all user actions (favorites, cart updates, promo code applications, cancellations).

---

## 🎨 Design System & Aesthetics

| Token | Dark Mode (Default) | Light Mode |
|---|---|---|
| **Background Primary** | `#07111F` (Midnight Navy) | `#F8FAFC` (Pure Pearl) |
| **Surface Elevated** | `#0B132B` (Deep Navy) | `#FFFFFF` (Card White) |
| **Accent Primary** | `#2563EB` (Electric Blue) | `#2563EB` (Electric Blue) |
| **Accent Secondary** | `#06B6D4` (Cyan Glow) | `#06B6D4` (Cyan Accent) |
| **Success State** | `#10B981` (Emerald Green) | `#10B981` (Emerald Green) |
| **Typography** | *Outfit* & *Plus Jakarta Sans* | *Outfit* & *Plus Jakarta Sans* |

---

## 💻 Tech Stack
- **Structure**: HTML5 with semantic tags and accessible ARIA attributes.
- **Styling**: Tailwind CSS CDN + custom CSS3 design tokens (`style.css`), luxury glassmorphism, responsive grid layouts, and custom print styles.
- **Icons**: Lucide Icons CDN.
- **Logic**: Modern Vanilla JavaScript (ES6+), local state management, and `localStorage` persistence.
- **Dependencies**: 0 local dependencies, 0 build tools. Runs immediately in any browser.
