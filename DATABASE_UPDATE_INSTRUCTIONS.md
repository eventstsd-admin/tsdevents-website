# Database Update Instructions - City and Number of Guests

## Overview
Added two new fields to the bookings table: `city` and `number_of_guests` to capture more detailed event information.

## Database Migration

### 1. Run SQL Migration in Supabase
Navigate to your Supabase project SQL Editor and run the migration file:

**File:** `supabase/sqls/add_city_and_guests_to_bookings.sql`

```sql
-- Add City and Number of Guests columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS number_of_guests INTEGER;

COMMENT ON COLUMN public.bookings.city IS 'City where the event will take place';
COMMENT ON COLUMN public.bookings.number_of_guests IS 'Expected number of guests for the event';
```

## Files Updated

### 1. TypeScript Types (`src/supabase.ts`)
Updated the `Booking` interface to include the new fields:
```typescript
export interface Booking {
  id: string;
  client_name: string;
  event_type: string;
  date: string;
  city?: string;                    // NEW
  number_of_guests?: number;        // NEW
  status: 'confirmed' | 'pending' | 'in_progress';
  amount: number;
  created_at?: string;
}
```

### 2. Admin Dashboard Display (`src/app/pages/AdminDashboard.tsx`)
Updated both booking tables (Overview and Bookings tabs) to display:
- **City** column (shows "-" if empty)
- **Guests** column (shows "-" if empty)

**Changes:**
- Added two new columns to table headers
- Added data cells to display `booking.city` and `booking.number_of_guests`
- Used fallback values ("-") for empty fields

## Frontend Display

### Current State
The new fields are now displayed in:
- ✅ **Admin Dashboard - Overview Tab**: Bookings table shows City and Guests
- ✅ **Admin Dashboard - Bookings Tab**: Full bookings list shows City and Guests

### Existing Booking Flow
The `BookingFlow.tsx` page already captures:
- `location` field (maps to city)
- `guests` field (maps to number_of_guests)

**Note:** The current BookingFlow doesn't save to database yet - it only shows a success toast. When you connect it to the database, map:
```typescript
// In handleSubmit function
{
  client_name: formData.name,
  event_type: formData.eventType,
  date: formData.date,
  city: formData.location,              // Map location to city
  number_of_guests: Number(formData.guests), // Map guests to number_of_guests
  status: 'pending',
  amount: // calculate based on budget
}
```

## Testing Checklist

- [ ] Run the SQL migration in Supabase SQL Editor
- [ ] Verify columns exist: `SELECT city, number_of_guests FROM bookings LIMIT 1;`
- [ ] Check Admin Dashboard displays new columns correctly
- [ ] Test with null/empty values (should show "-")
- [ ] Test with actual data to ensure proper display

## Data Validation

### City Field
- Type: `TEXT`
- Optional: Yes
- Validation: None (can be any text)

### Number of Guests Field
- Type: `INTEGER`
- Optional: Yes
- Validation: Should be positive integer when provided

### Backward Compatibility
Both fields are optional (`?` in TypeScript), so:
- ✅ Existing bookings without these fields will work
- ✅ New bookings can be created with or without these fields
- ✅ Admin tables show "-" for empty values

## Next Steps (If Needed)

1. **Add validation** to BookingFlow form for guest count:
   ```typescript
   if (formData.guests && Number(formData.guests) < 1) {
     toast.error('Please enter a valid number of guests');
     return;
   }
   ```

2. **Make fields required** in booking flow (optional):
   - Update validation in `handleNext()` for step 2
   - Add asterisks (*) to required field labels

3. **Add search/filter** by city in admin dashboard:
   - Add dropdown filter above booking tables
   - Filter bookings by selected city

4. **Add to booking emails/notifications**:
   - Include city and guest count in confirmation emails
   - Show in customer booking receipts
