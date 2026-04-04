# Rate Limiting Implementation Guide

## ✅ What's Been Added

### 1. **Edge Function Rate Limiting** (Cloudinary Upload)
- **File:** `supabase/functions/sign-cloudinary-upload/index.ts`
- **Limit:** 10 requests per minute per IP
- **Response:** HTTP 429 with "Retry-After: 60" header
- **Status:** ✅ Already implemented

### 2. **Frontend Rate Limiting Utility**
- **File:** `src/rateLimiter.ts`
- **Includes:** 4 pre-configured rate limiters
  - `contactFormLimiter`: 3 requests per minute
  - `bookingFormLimiter`: 2 requests per minute
  - `inquiryLimiter`: 5 requests per 5 minutes
  - `uploadLimiter`: 10 requests per minute

---

## 🔧 How to Use in Your Components

### Example 1: Contact Form Rate Limiting

```typescript
import { contactFormLimiter } from '../../rateLimiter';
import { toast } from 'sonner';

// In your component
const handleSubmit = async () => {
  // Check rate limit using user's email as key
  if (!contactFormLimiter.isAllowed(userEmail)) {
    const remaining = contactFormLimiter.getRemainingTime(userEmail);
    const seconds = Math.ceil(remaining / 1000);
    toast.error(`Too many requests. Please wait ${seconds}s before trying again.`);
    return;
  }

  // Proceed with form submission
  await submitContactForm();
};
```

### Example 2: Booking Form Rate Limiting

```typescript
import { bookingFormLimiter } from '../../rateLimiter';
import { toast } from 'sonner';

const handleBookingSubmit = async () => {
  if (!bookingFormLimiter.isAllowed('booking')) {
    toast.error('Too many booking attempts. Please wait before trying again.');
    return;
  }

  await submitBooking();
};
```

### Example 3: File Upload Rate Limiting

```typescript
import { uploadLimiter } from '../../rateLimiter';
import { toast } from 'sonner';

const handleImageUpload = async (file: File) => {
  const userIP = 'client-ip'; // or use user ID
  if (!uploadLimiter.isAllowed(userIP)) {
    const remaining = uploadLimiter.getRemainingRequests(userIP);
    toast.error(`Upload limit reached. Try again later.`);
    return;
  }

  await uploadImage(file);
};
```

---

## 📊 Rate Limit Configuration

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| Contact Form | 3 | 1 minute | Prevent spam |
| Booking Form | 2 | 1 minute | Prevent abuse |
| Inquiry | 5 | 5 minutes | Allow legitimate inquiries |
| Upload | 10 | 1 minute | Prevent bulk uploads |
| Cloudinary (Edge) | 10 | 1 minute | Backend rate limit |

---

## 🎯 Files That Need Updates

### 1. `src/app/pages/ContactPage.tsx`
```typescript
// Add at top
import { contactFormLimiter } from '../../rateLimiter';

// In your submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!contactFormLimiter.isAllowed(formData.email)) {
    toast.error('Too many requests. Please wait before trying again.');
    return;
  }

  // ... rest of submit logic
};
```

### 2. `src/app/pages/BookingFlow.tsx`
```typescript
// Add at top
import { bookingFormLimiter } from '../../rateLimiter';

// In handleSubmit
const handleSubmit = () => {
  if (!bookingFormLimiter.isAllowed('booking')) {
    toast.error('Too many booking attempts. Please wait before trying again.');
    return;
  }

  // ... rest of submit logic
};
```

### 3. `src/app/components/GalleryUpload.tsx`
```typescript
// Add at top
import { uploadLimiter } from '../../rateLimiter';

// In handleUpload
const handleUpload = async () => {
  if (!uploadLimiter.isAllowed(userEmail || 'anonymous')) {
    toast.error('Upload limit reached. Please wait before uploading again.');
    setLoading(false);
    return;
  }

  // ... rest of upload logic
};
```

---

## 🔒 How Rate Limiting Works

### Client-Side (Frontend)
1. User submits form
2. Check if they've exceeded limit
3. If yes → Show error message
4. If no → Allow submission and increment counter
5. Counter resets after time window expires

### Server-Side (Edge Function)
1. Client makes request with IP
2. Server checks if IP exceeded limit
3. If yes → Return 429 (Too Many Requests)
4. If no → Process request and increment counter
5. Counter resets after time window expires

### Both Together = Strong Protection
- Frontend stops spam before reaching server
- Backend catches requests bypassing frontend
- Double protection against abuse

---

## 📝 Customizing Limits

To change limits, edit `src/rateLimiter.ts`:

```typescript
const DEFAULT_LIMITS = {
  contact: { maxRequests: 5, windowMs: 120000 }, // 5 per 2 minutes
  booking: { maxRequests: 3, windowMs: 60000 },  // 3 per 1 minute
  inquiry: { maxRequests: 10, windowMs: 300000 }, // 10 per 5 minutes
  upload: { maxRequests: 20, windowMs: 60000 },  // 20 per 1 minute
};
```

---

## ✅ Verification Checklist

- [x] Edge function rate limiting added (10/min per IP)
- [x] Frontend rate limiter utility created
- [x] 4 pre-configured limiters available
- [ ] Contact form integrated with rate limiting
- [ ] Booking form integrated with rate limiting
- [ ] Upload components integrated with rate limiting
- [ ] Test rate limiting in development
- [ ] Monitor abuse patterns in production

---

## 🚀 Next Steps

1. **Integrate with Contact Form** - Add rate limiting to `ContactPage.tsx`
2. **Integrate with Booking** - Add rate limiting to `BookingFlow.tsx`
3. **Integrate with Uploads** - Add rate limiting to upload components
4. **Test Thoroughly** - Verify limits work as expected
5. **Monitor Logs** - Check edge function logs for 429 responses

---

## 📊 Monitoring

Check your Supabase edge function logs for rate limit hits:

1. Go to **Supabase Dashboard**
2. **Functions** → **sign-cloudinary-upload**
3. **Logs** tab
4. Look for HTTP 429 responses

This shows you who's being rate limited and when.

---

## 🔗 References

- Rate Limiter Code: `src/rateLimiter.ts`
- Edge Function: `supabase/functions/sign-cloudinary-upload/index.ts`
- Usage: Import and call `isAllowed()` before sensitive operations
