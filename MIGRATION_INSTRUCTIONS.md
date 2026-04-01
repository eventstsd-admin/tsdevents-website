# Migration Instructions - Database Schema Update

## ⚠️ CRITICAL: Your app is expecting a new database schema

**Current Issue:** Past events show in frontend but NOT in admin panel because the database schema doesn't match what the application expects.

---

## What Needs to Happen

### 1. **Run the Migration Script in Supabase** (REQUIRED)

This will update your database schema to the correct structure:

1. Go to: **https://supabase.com** → Your Project
2. Click **SQL Editor** → **New Query**
3. Copy the ENTIRE content from: `supabase/migrate-to-event-date.sql`
4. Paste into SQL Editor
5. Click **RUN** button
6. ✅ Wait for success message

**What this does:**
- ❌ Drops old `past_events` table (if it exists)
- ✅ Creates new `past_events` table with correct columns:
  - `id` (UUID)
  - `title` (TEXT)
  - `description` (TEXT) - optional
  - `category` (TEXT)
  - `event_date` (DATE) ← This is the key fix
  - `location` (TEXT) - optional
  - Timestamps (created_at, updated_at)

- ✅ Creates `event_photos` table with proper foreign key to `past_events`
- ✅ Sets up Row Level Security (RLS) policies
- ✅ Creates indexes for performance

---

## Why Past Events Don't Show in Admin

**Database Schema Mismatch:**
- Old schema: `date` + `time` (two separate columns)
- New schema: `event_date` (single DATE column)
- Frontend queries old schema → works ✅
- Admin queries new schema → error ❌

---

## After Running Migration

### Step 1: Test Event Creation
1. Go to Admin Dashboard → **Past Events** tab
2. Click **Add New Past Event** button
3. Fill in:
   - **Title** (required)
   - **Date** (required) - use the date picker
   - **Category** (required)
   - Description (optional)
   - Location (optional)
4. Click **Create Event** → Should show ✅ success toast

### Step 2: Test Photo Upload
1. Your new event will appear in the list below
2. Click the event to expand it
3. Click **Add Photos** section
4. Upload images (max 5)
5. Images should upload to Cloudinary and appear in list

### Step 3: Verify in Frontend
1. Go to **Gallery** → **Past Events**
2. You should see all events you've created ✅

---

## Troubleshooting

### If you still get "column does not exist" error:
1. Check that the migration ran successfully (no red error messages)
2. Go to **Supabase Dashboard** → **Table Editor**
3. Look for `past_events` table
4. Click it and verify columns: `id`, `title`, `description`, `category`, `event_date`, `location`
5. If missing, re-run the migration script

### If events still don't show after migration:
1. Hard refresh the app: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear browser cache
3. Check browser console (F12) for any errors
4. Verify `.env` file has correct Supabase credentials

---

## Files Updated ✅

### Frontend Code Changes (DONE):
- ✅ `src/routes.tsx` - Removed booking route
- ✅ `src/app/pages/AdminDashboardNewCorrect.tsx` - Removed booking tab
- ✅ `src/supabase.ts` - Updated PastEvent interface to use `event_date`
- ✅ Headers and navigation - removed booking links

### Database Migration (PENDING):
- ⏳ `supabase/migrate-to-event-date.sql` - Run this in Supabase SQL Editor

---

## Quick Checklist

- [ ] Run migration script in Supabase SQL Editor
- [ ] Wait for success (no red errors)
- [ ] Hard refresh app in browser
- [ ] Test: Create a new past event in admin
- [ ] Test: Upload photos to event
- [ ] Test: See event in frontend gallery
- [ ] Test: No booking option anywhere in app ✅

---

**Need Help?**
If you encounter errors:
1. Check the Supabase error message in SQL Editor
2. Verify table names and column names match exactly
3. Ensure RLS policies were created (should see green checkmarks)
4. Check browser console (F12) for JavaScript errors
