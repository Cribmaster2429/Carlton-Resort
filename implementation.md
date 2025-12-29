# Carlton Resort - Implementation Plan

This document outlines the current state of the codebase and the roadmap for completing the application.

---

## Current State Assessment

### What Works (UI Only)

| Feature | Status | Notes |
|---------|--------|-------|
| Home page layout | Working | Displays all sections |
| Navigation | Working | Links to sections via anchor tags |
| Search bar | Partial | Navigates to `/hotels` but doesn't filter results |
| Date picker | Working | UI functional, selects date range |
| Guest counter | Working | UI functional, increments/decrements |
| List page | Partial | Displays hardcoded results, no actual filtering |
| Hotel detail page | Partial | Shows hotel info, image slider works |
| Responsive design | Not implemented | Desktop only |

### What's Non-Functional

| Feature | Current State | What's Needed |
|---------|---------------|---------------|
| Search filtering | Button navigates but doesn't filter | Implement actual search logic |
| "See availability" buttons | No onClick handler | Connect to hotel detail or booking |
| "Reserve or book now" buttons | No onClick handler | Build booking/checkout flow |
| Login/Register buttons | No onClick handler | Build auth modal + backend |
| PayPal integration | SDK installed, unconfigured | Implement createOrder, onApprove handlers |
| Backend API | Referenced but doesn't exist | Build Node.js/Express API or use mock data |

### Current User Flow

```
Home Page
    ↓
Search (destination, dates, guests)
    ↓
Navigate to /hotels (List Page)
    ↓
Display hardcoded results (no filtering)
    ↓
"See availability" → DEAD END (no handler)
    ↓
Manual navigation to /hotels/:id
    ↓
Hotel Detail Page
    ↓
"Reserve or book now" → DEAD END (no handler)
```

---

## Phase 1: UI/UX Improvements (Current)

### Completed
- [x] Migrated from Create React App to Vite
- [x] Updated React to v19
- [x] Redesigned header with resort-specific navigation
- [x] Applied oceanic Hawaiian color theme
- [x] Created section components (Dining, Experiences, Spa, Events)
- [x] Unified navbar and header styling

### In Progress
- [x] Add Login modal component
- [x] Add "Book Now" CTA to navbar
- [x] Remove duplicate auth button from header
- [ ] Fix broken external image URLs

### Pending
- [ ] Add responsive design (mobile/tablet)
- [ ] Add loading states
- [ ] Add error boundaries

---

## Phase 2: Core Functionality

### Authentication System
- [ ] Create AuthModal component (Login/Register tabs)
- [ ] Implement form validation
- [ ] Set up auth context for state management
- [ ] Connect to backend (or mock for demo)

### Search & Filter
- [ ] Implement actual search filtering on List page
- [ ] Add price range filter functionality
- [ ] Add guest count filter functionality
- [ ] Create search results state management

### Booking Flow
- [ ] Create room selection UI on Hotel page
- [ ] Build checkout/booking form component
- [ ] Implement date availability checking
- [ ] Add booking confirmation page

---

## Phase 3: Payment Integration

### PayPal Setup
- [ ] Configure PayPal SDK with sandbox credentials
- [ ] Implement createOrder handler
- [ ] Implement onApprove handler
- [ ] Add payment confirmation UI
- [ ] Handle payment errors gracefully

---

## Phase 4: Backend (Optional for Frontend Demo)

### If Building Full-Stack
- [ ] Set up Node.js/Express server
- [ ] Create MongoDB/PostgreSQL database
- [ ] Build REST API endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/hotels`
  - `GET /api/hotels/:id`
  - `POST /api/bookings`
  - `GET /api/bookings/:userId`

### If Frontend-Only Demo
- [ ] Create mock data files (hotels.js, rooms.js)
- [ ] Simulate API responses with delays
- [ ] Use localStorage for user session
- [ ] Use localStorage for booking history

---

## File Structure

```
Carlton-Resort/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── index.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── authModal/          # NEW - Login/Register modal
│   │   ├── dining/
│   │   ├── events/
│   │   ├── experiences/
│   │   ├── featured/
│   │   ├── featuredProperties/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── mailList/
│   │   ├── navbar/
│   │   ├── propertyList/
│   │   ├── searchItem/
│   │   └── spa/
│   ├── pages/
│   │   ├── home/
│   │   ├── hotel/
│   │   ├── list/
│   │   └── checkout/           # NEW - Booking checkout
│   ├── context/                # NEW - Auth, Booking state
│   └── data/                   # NEW - Mock data (if no backend)
└── public/
    └── images/
```

---

## Commands Reference

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Priority Order for Capstone

1. **High Priority** - Makes it look professional
   - Login modal (shows modern UI patterns)
   - Working search filter (core functionality)
   - Booking flow with confirmation page

2. **Medium Priority** - Adds polish
   - PayPal integration (even sandbox mode)
   - Responsive design
   - Loading/error states

3. **Lower Priority** - Nice to have
   - Full backend implementation
   - User booking history
   - Email confirmations
