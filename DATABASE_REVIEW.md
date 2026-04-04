# Database Table Usage Review

## Summary

✅ **REMOVED FROM APP:** "Manage Events" menu item (no longer in admin dashboard)  
✅ **SAFE TO DELETE:** `events` and `gallery_images` tables  
❌ **DO NOT DELETE:** `past_events` and `event_photos` tables (ACTIVELY USED)

---

## Admin Dashboard Changes

The "Manage Events" tab has been removed from the admin dashboard sidebar.

**Remaining tabs:**
- Dashboard (overview stats)
- Bookings (customer bookings)
- Past Events (portfolio management)
- Inquiries (contact form submissions)
- Settings

---

## Detailed Analysis

### 1. `gallery_images` Table ❌ NOT USED

**Status:** SAFE TO DELETE

**Why it exists:**  
This was an old table for gallery images, but it's been replaced by the `past_events` + `event_photos` architecture.

**Current usage:**
- ❌ Only 1 file references it: `src/app/components/GalleryUpload.tsx` (line 79)
- ❌ This component is NOT imported/used anywhere in the app
- ❌ Gallery page DOES NOT fetch from this table

**Recommendation:** DELETE this table and the unused `GalleryUpload.tsx` component.

```sql
DROP TABLE IF EXISTS gallery_images CASCADE;
```

---

### 2. `events` Table ❌ NOT USED

**Status:** SAFE TO DELETE (removed from admin dashboard)

**Why it exists:**  
This was intended for "service packages" but was never implemented or used.

**Current usage:**
- ❌ Had a "Manage Events" tab in admin dashboard (NOW REMOVED)
- ❌ The tab had no functionality (buttons didn't work)
- ❌ Table is empty and not used anywhere on the website

**Recommendation:** DELETE this table.

```sql
DROP TABLE IF EXISTS events CASCADE;
```

---

### 3. `past_events` Table ✅ ACTIVELY USED

**Status:** DO NOT DELETE - CRITICAL TABLE

**Purpose:**  
Stores information about completed events (title, description, category, date, location).

**Current usage:**
- ✅ Used in **GalleryPage.tsx** (joins with event_photos to display gallery)
- ✅ Used in **AdminDashboard.tsx** (line 49) - manages past events
- ✅ Used in **PastEventManager.tsx** - admin component for managing past events
- ✅ Used in **PastEventsManagerNew.tsx** - another past event manager
- ✅ Has 6 operations in `supabase.ts`:
  - `pastEventOperations.getAll()`
  - `pastEventOperations.getById()`
  - `pastEventOperations.create()`
  - `pastEventOperations.update()`
  - `pastEventOperations.delete()`
  - `pastEventOperations.getPhotos()`

**Schema:**
```sql
CREATE TABLE past_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,  -- Added later
  event_date DATE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 4. `event_photos` Table ✅ ACTIVELY USED

**Status:** DO NOT DELETE - CRITICAL TABLE

**Purpose:**  
Stores photos for past events (max 5 per event). This is what powers the Gallery page.

**Current usage:**
- ✅ Used in **GalleryPage.tsx** (line 42) - fetches all photos with category from past_events
- ✅ Used in **PastEventUpload.tsx** (line 101) - uploads photos for events
- ✅ Used in **PastEventUploadNew.tsx** (line 179) - uploads photos for events
- ✅ Used in **PastEventsManagerNew.tsx** (line 192) - manages event photos
- ✅ Has operation in `supabase.ts`: `pastEventOperations.getPhotos(eventId)`

**Schema:**
```sql
CREATE TABLE event_photos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_id UUID NOT NULL REFERENCES past_events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text VARCHAR(255),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, url)
);
```

**Relationship:**  
- `event_photos.event_id` → `past_events.id` (foreign key)
- Each past_event can have up to 5 photos
- Gallery page joins these tables to show category on images

---

### 5. `bookings` Table ✅ USED (Different Purpose)

**Status:** DO NOT DELETE - DIFFERENT USE CASE

**Purpose:**  
Stores **event PACKAGES/SERVICES** that customers can book (e.g., "Wedding Package", "Corporate Event Package").

**NOT the same as `past_events`:**
- `events` = Service offerings/packages you sell
- `past_events` = Completed events you've done (portfolio)

**Current usage:**
- ✅ Used in **AdminDashboard.tsx** - manage event packages
- ✅ Has 4 operations in `supabase.ts`:
  - `eventOperations.getAll()`
  - `eventOperations.create()`
  - `eventOperations.update()`
  - `eventOperations.delete()`

**Schema:**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price_range TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

---

## Table Relationships

```
past_events (portfolio items)
    ↓ (1-to-many)
event_photos (photos of completed events)
    ↓ (displayed in)
Gallery Page
```

```
events (service packages)
    ↓ (managed in)
Admin Dashboard → Events Tab
```

```
bookings (customer bookings)
    ↓ (references)
events (what service they booked)
```

---

## Action Items

### ✅ Safe to Delete
1. **Drop `gallery_images` table:**
   ```sql
   DROP TABLE IF EXISTS gallery_images CASCADE;
   ```

2. **Delete unused component:**
   ```bash
   # Delete the file
   rm src/app/components/GalleryUpload.tsx
   ```

### ❌ Do NOT Delete
- ❌ `past_events` - Used for portfolio/completed events
- ❌ `event_photos` - Used for gallery images
- ❌ `events` - Used for service packages
- ❌ `bookings` - Used for customer bookings
- ❌ `inquiries` - Used for contact form submissions

---

## Summary Table

| Table Name       | Status        | Used By                                      | Purpose                          |
|------------------|---------------|----------------------------------------------|----------------------------------|
| `gallery_images` | ❌ DELETE      | Nothing (orphaned)                           | Old gallery storage (replaced)   |
| `past_events`    | ✅ KEEP        | Gallery, Admin Dashboard, 3 managers         | Portfolio of completed events    |
| `event_photos`   | ✅ KEEP        | Gallery, Upload components                   | Photos for past events           |
| `events`         | ✅ KEEP        | Admin Dashboard                              | Service packages for sale        |
| `bookings`       | ✅ KEEP        | Admin Dashboard, Booking Flow                | Customer bookings                |
| `inquiries`      | ✅ KEEP        | Contact Page, Admin Dashboard                | Contact form submissions         |

---

## Verification Commands

Run these in Supabase SQL Editor to check if tables have data:

```sql
-- Check if gallery_images has data (should be empty or not exist)
SELECT COUNT(*) as count FROM gallery_images;

-- Check if past_events has data
SELECT COUNT(*) as count FROM past_events;

-- Check if event_photos has data
SELECT COUNT(*) as count FROM event_photos;

-- See relationship between past_events and event_photos
SELECT 
  pe.title,
  COUNT(ep.id) as photo_count
FROM past_events pe
LEFT JOIN event_photos ep ON pe.id = ep.event_id
GROUP BY pe.id, pe.title;
```
