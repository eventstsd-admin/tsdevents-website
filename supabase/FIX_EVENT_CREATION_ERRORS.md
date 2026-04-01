# How to Fix Event Creation Errors

## The Problem
You're getting "Error creating event" because:
1. **RLS Policies are blocking inserts** - Even though you're authenticated, the policy check is failing
2. **Foreign key might be broken** - event_photos table might have wrong foreign key to past_events
3. **Schema mismatch** - The tables might have been created incorrectly

## The Solution

### Step 1: Run the Fix SQL in Supabase

1. Go to: **Supabase Dashboard** → Your Project → **SQL Editor**
2. Click **"New Query"** 
3. Copy the entire content from: `supabase/fix_all_errors.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or Cmd+Enter / Ctrl+Enter)

**Expected output**: No errors, just green checkmarks

### Step 2: Verify the Fix (Optional)

The SQL file has verification queries at the bottom (commented out). After running the fix, you can uncomment these to verify:
- Foreign key relationship exists
- RLS policies are in place
- Table schemas are correct

### Step 3: Test Event Creation

1. Go to your app's **Admin Dashboard** → **Past Events tab**
2. Click **"Add New Past Event"** button
3. Fill in:
   - Event title (required)
   - Date (required) 
   - Category (required)
   - Description (optional)
   - Location (optional)
4. **Do NOT select images yet** - just test event creation first
5. Click **"Create Event"**

**Expected**: Green toast saying "Event created! Now upload photos..."

### Step 4: Test Image Upload

If event creation works, then test image upload:
1. The newly created event will appear in the list below
2. Click on it to expand
3. Click **"Add Photos"**
4. Select up to 5 images
5. Photos should compress and upload to Cloudinary

---

## What the Fix Does

### Database Changes
- **Recreates event_photos table** with proper UUID foreign key to past_events
- **Sets up cascading deletes** - deleting an event deletes all its photos
- **Adds indexes** for better performance

### Security Changes
- **New RLS policies** that explicitly check for admin role
- **Separate permissions for SELECT, INSERT, UPDATE, DELETE**
- **Everyone can view events and photos** (SELECT allowed)
- **Only admins can create/edit/delete** (INSERT/UPDATE/DELETE require admin role)

### How Admin Check Works
The RLS policy checks: 
```sql
(SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
```

This means:
- User must be logged in (`auth.uid()` returns their ID)
- User's metadata must have `role: "admin"` set
- Only then can they create/edit/delete events and photos

---

## If It Still Doesn't Work

**Check these things:**

1. **Are you actually logged in as admin?**
   - Go to `/admin` 
   - You should see "Admin Login" page
   - Login with your admin credentials
   - You should see the dashboard with tabs

2. **Is your admin account set up correctly?**
   - Go to **Supabase Dashboard** → **Authentication** → **Users**
   - Find your admin user
   - Click on them → **Edit** → **User Metadata**
   - Add: `{ "role": "admin" }`
   - Click **Save**

3. **Check browser console for errors**
   - Open **Developer Tools** (F12)
   - Go to **Console** tab
   - Look for red error messages
   - Copy the full error and ask for help

4. **Check Supabase logs**
   - Go to **Supabase Dashboard** → **Logs** 
   - Look for recent errors
   - These often show the exact RLS policy issue

---

## Next Steps

After fixing event creation:
1. Create a test event
2. Test image upload separately (images only upload after event exists)
3. Verify images appear in Supabase `event_photos` table
4. Check Cloudinary to see if images were uploaded

If anything fails, share:
- The error message (screenshot or console error)
- What you were trying to do
- Whether it's an INSERT/UPDATE/DELETE error
