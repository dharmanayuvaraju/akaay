# Akaay Boutique | Handcrafted Indian Fashion E-Commerce Platform

A complete, original women's fashion e-commerce web platform designed for boutique client pitches. Features authentic Indian boutique catalog browsing, live discount shopping, sliding bag drawer, simulated OTP customer authentication, WhatsApp direct ordering, real-time stage-by-stage order tracking, and an integrated Owner & Staff Back Office sharing a simulated reactive database via `localStorage`.

---

## Brand & Aesthetics

- **Wordmark:** "Akaay" in serif *Fraunces* with an artisanal dashed stitched-line motif.
- **Palette:**
  - Warm Ivory: `#FBF7F0`
  - Deep Ink: `#2B2118`
  - Terracotta Accent: `#C05621`
  - Soft Marigold: `#E9B44C`
- **Typography:** Fraunces (display headings) + Inter (body typography).
- **Quality Budget:** Route-level code splitting (~107 KB gzip initial bundle), 44px minimum tap targets, zero horizontal overflow, 4:5 fixed image ratios, and mobile-first design (tested at 390px).

---

## Features & Routes

### Customer Storefront
- `/`: Home Page (5s auto-advancing carousel with mobile swipe, 6 category tiles, Budget Finds strip under ₹499/699/899/999, Bestsellers, New Arrivals, and patron testimonials).
- `/shop/:category` & `/shop/all`: Filterable catalog by category, price ranges, and palette chips with sort controls.
- `/product/:id`: Multi-angle gallery with zoom, color swatches, size buttons with live stock alerts, Size Guide modal, craft accordions, and WhatsApp stylist consult.
- `/offers`: Boutique offers and price-band specials.
- `/new-arrivals`: Fresh off the loom collection.
- `/best-selling`: Cherished customer favorites.
- `/checkout`: Simulated phone number login (accepts any 6-digit demo OTP), address capture, and mock payment (UPI apps, Card, COD) with prominent demo warnings.
- `/order-success`: Confirmation screen with order identifier (`AKY-XXXX`), delivery ETA, and WhatsApp sharing.
- `/track-order`: Live step-by-step timeline (*Placed → Packed → Shipped → Out for delivery → Delivered*) reactive to owner updates.
- `/wishlist`: Saved ensembles grid.
- `/account`: Patron profile, live order status cards, and direct order tracking.
- `/about`: Atelier story, Banjara Hills showroom, and weaver cooperatives.
- `/contact`: Concierge contacts, showroom hours, and message dispatch.

### Owner Back Office
- `/owner/login`: Simulated administrative authentication for Owner (Yuvaraj: `7337422054`) and Staff (`9876543210`).
- `/owner`: Real-time analytics dashboard (gross revenue, orders, units sold, catalog size, out-of-stock count), low-stock alert feed ($\le 3$ units), and recent order stream.
- `/owner/products`: Add / Edit / Delete catalog ensembles with instant customer storefront synchronization.
- `/owner/products/:id/stock`: Per-size $+/-$ steppers with numeric input and live "Sold Out" ribbon sync.
- `/owner/orders`: Advance order fulfillment stage-by-stage and dispatch order summaries directly to customers via WhatsApp.
- `/owner/staff`: Role-based team management (Manager & Sales permissions; owner-only access).
- `/owner/offers`: Live editing of top announcement text, hero discount badge, and per-ensemble discount badge overrides.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Routing:** React Router 7
- **Persistence:** Reactive browser `localStorage`

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Owner: **Yuvaraj** (+91 73374 22054)  
Store: **Akaay Boutique**
