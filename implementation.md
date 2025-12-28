# Carlton Resort - Implementation Plan

This document outlines the steps to migrate from Create React App to Vite, fixing all security vulnerabilities and modernizing the codebase.

---

## Phase 1: Migrate to Vite

### Step 1: Create Vite config file

Create `vite.config.js` in the root:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

### Step 2: Update package.json

Replace the scripts and dependencies:

**Remove these dependencies:**
- `react-scripts`
- `web-vitals`
- `@testing-library/*` (if not using tests)

**Add these dev dependencies:**
- `vite`
- `@vitejs/plugin-react`

**Update scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 3: Move and rename index.html

1. Move `public/index.html` to the root folder
2. Update the HTML:
   - Remove `%PUBLIC_URL%` references
   - Add the script tag before `</body>`:
     ```html
     <script type="module" src="/src/index.jsx"></script>
     ```

### Step 4: Rename entry file

Rename `src/index.js` to `src/index.jsx`

### Step 5: Update environment variables (if any)

- CRA uses `REACT_APP_` prefix
- Vite uses `VITE_` prefix
- Access via `import.meta.env.VITE_*` instead of `process.env.REACT_APP_*`

### Step 6: Clean install

```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 7: Test the migration

```bash
npm run dev
```

---

## Phase 2: Update Dependencies

### Step 1: Update React to v19 (optional)

```bash
npm install react@latest react-dom@latest
```

### Step 2: Update all other dependencies

```bash
npm update
```

### Step 3: Verify zero vulnerabilities

```bash
npm audit
```

---

## Phase 3: Code Improvements

### Current Issues to Address

1. **Hardcoded images** - Images are external URLs from travellersbeach.com
   - Download and store locally in `/public/images`
   - Or set up proper image hosting

2. **No backend connection** - The app references `localhost:8800/api` but no backend exists
   - Either build a backend (Node.js/Express + database)
   - Or use mock data for frontend-only demo

3. **Static data** - Hotel listings, prices, etc. are hardcoded
   - Create a data file or connect to a backend

4. **Missing features** - Based on your todo file:
   - [ ] Search validation (prevent empty searches)
   - [ ] Change currency to KES
   - [ ] Add favicon
   - [ ] Individual hotel data for SearchItem components

---

## Phase 4: Feature Completion

### Core Features Needed

1. **Authentication**
   - Login/Register functionality
   - User session management

2. **Booking System**
   - Room selection
   - Date validation
   - Payment integration (PayPal is already in dependencies)

3. **Hotel Management**
   - Individual hotel pages with real data
   - Room types and availability
   - Pricing per room type

4. **Search & Filter**
   - Working search by destination
   - Price range filtering
   - Guest count filtering

---

## File Structure After Migration

```
Carlton-Resort/
├── index.html              # Moved from public/
├── vite.config.js          # New Vite config
├── package.json            # Updated dependencies
├── src/
│   ├── index.jsx           # Renamed from index.js
│   ├── App.jsx             # Main app component
│   ├── components/
│   │   ├── featured/
│   │   ├── featuredProperties/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── mailList/
│   │   ├── navbar/
│   │   ├── propertyList/
│   │   └── searchItem/
│   └── pages/
│       ├── home/
│       ├── hotel/
│       └── list/
└── public/
    └── images/             # Local images
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

# Check for vulnerabilities
npm audit

# Update dependencies
npm update
```

---

## Notes

- The migration preserves all existing React components
- CSS files remain unchanged
- Routing (react-router-dom) works the same way
- The only changes are in build tooling, not application code
