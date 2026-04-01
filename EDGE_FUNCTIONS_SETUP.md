# Edge Functions Setup Guide - Cloudinary Signing

## 📋 What Are Edge Functions?

**Edge Functions** are serverless functions that run on Supabase's edge network. They're perfect for:
- ✅ Server-side operations that don't expose secrets
- ✅ Signing requests to third-party APIs (like Cloudinary)
- ✅ Protecting API keys from being exposed in frontend code
- ✅ Fast execution at the edge (closest to users)

---

## 🔧 What I Created for You

**Edge Function:** `sign-cloudinary-upload`
- **Location:** `supabase/functions/sign-cloudinary-upload/`
- **Purpose:** Generates safe Cloudinary upload signatures without exposing your API secret
- **Trigger:** Called from frontend when users upload images

### How It Works:

```
User Uploads Image
    ↓
Frontend calls Edge Function
    ↓
Edge Function creates SHA-1 signature (using Cloudinary API secret)
    ↓
Returns safe signature to frontend (secret never exposed)
    ↓
Frontend uploads to Cloudinary with signature
    ↓
Cloudinary validates signature = request is legitimate ✅
```

---

## 📚 Files Created/Modified

### Created:
- ✅ `supabase/functions/sign-cloudinary-upload/index.ts` - Edge Function code
- ✅ `supabase/functions/sign-cloudinary-upload/deno.json` - Deno configuration

### Updated:
- ✅ `src/app/components/PastEventsManagerNew.tsx`
- ✅ `src/app/components/PastEventUploadNew.tsx`
- ✅ `src/app/components/PastEventUpload.tsx`
- ✅ `src/app/components/GalleryUpload.tsx`

All upload components now use the Edge Function to get signatures.

---

## 🚀 Setup Steps - REQUIRED

### Step 1: Set Environment Variables in Supabase

These variables are **not in your `.env` file** - they go to **Supabase directly**.

1. Go to: **Supabase Dashboard** → Your Project
2. Click **Settings** → **Edge Functions**
3. Click **Secrets** or look for **Environment Variables**
4. Add these secrets:

| Variable | Value | Source |
|----------|-------|--------|
| `CLOUDINARY_CLOUD_NAME` | `djvccbmtx` | From your Cloudinary account |
| `CLOUDINARY_API_SECRET` | `<your_api_secret>` | From Cloudinary settings (KEEP SECRET!) |
| `CLOUDINARY_UPLOAD_PRESET` | `tsd_events_gallery` | From Cloudinary settings |

**How to find Cloudinary values:**
1. Go to: `https://cloudinary.com/console/settings/c_credentials`
2. See `Cloud name` and `API Secret`
3. Click the eye icon to reveal the secret (don't share this!)

### Step 2: Deploy the Edge Function

The function is already created in your project folder. To deploy:

**Option A: Using Supabase CLI (Recommended)**
```bash
# Install Supabase CLI if you don't have it
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the Edge Function
supabase functions deploy sign-cloudinary-upload --project-id your_project_id
```

**Option B: Upload via Supabase Dashboard**
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **New Function** → **Create Function**
3. Copy code from: `supabase/functions/sign-cloudinary-upload/index.ts`
4. Paste into the editor
5. Click **Deploy**

### Step 3: Verify Deployment

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Look for `sign-cloudinary-upload`
3. Status should be **✅ Active**

---

## 🧪 Test the Setup

### Test in Browser Console:

```javascript
// Open DevTools (F12) and run this in Console:
const response = await fetch(
  'https://your_supabase_url/functions/v1/sign-cloudinary-upload',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY'
    }
  }
);

const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "cloud_name": "djvccbmtx",
  "signature": "abc123def456...",
  "timestamp": 1704067200,
  "upload_preset": "tsd_events_gallery"
}
```

---

## 🔐 Security Benefits

### Why Edge Functions are Better than Unsigned Uploads:

| Aspect | Unsigned (Before) | Edge Function (Now) |
|--------|-------------------|-------------------|
| API Secret | Exposed to frontend ❌ | Safe on server ✅ |
| Request Validation | No signature ❌ | Signed ✅ |
| Unauthorized Use | Anyone can upload ❌ | Only your app ✅ |
| Control | None ❌ | Full control ✅ |

---

## 📊 Flow Diagram

```
┌─────────────────────────────────────┐
│  Frontend (React Component)          │
│  - User selects images              │
│  - Calls Edge Function              │
└────────────┬────────────────────────┘
             │
             ↓ POST /sign-cloudinary-upload
┌─────────────────────────────────────┐
│  Edge Function (Supabase)            │
│  - Receives request                 │
│  - Loads Cloudinary API Secret      │
│  - Creates SHA-1 signature          │
│  - Returns signature + timestamp    │
└────────────┬────────────────────────┘
             │
             ↓ {cloud_name, signature, timestamp}
┌─────────────────────────────────────┐
│  Frontend (React Component)          │
│  - Receives signature               │
│  - Uploads to Cloudinary with sig   │
└────────────┬────────────────────────┘
             │
             ↓ POST /image/upload
┌─────────────────────────────────────┐
│  Cloudinary API                     │
│  - Validates signature              │
│  - Uploads image                    │
│  - Returns secure_url               │
└────────────┬────────────────────────┘
             │
             ↓ {secure_url, ...}
┌─────────────────────────────────────┐
│  Frontend (React Component)          │
│  - Saves URL to Supabase DB         │
│  - Shows success toast ✅            │
└─────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Error: "Failed to get upload signature"

**Cause:** Edge Function not deployed or environment variables missing

**Solution:**
1. Verify Edge Function is deployed (check Supabase Dashboard)
2. Check environment variables are set correctly
3. Check function logs in Supabase

### Error: "CORS policy: Response to preflight request"

**Cause:** Edge Function CORS headers missing

**Solution:**
The code already includes proper CORS headers. If still failing:
1. Check the error message in browser console (F12)
2. Redeploy the function
3. Clear browser cache (Ctrl+Shift+Delete)

### Error: "Cloudinary credentials not configured"

**Cause:** Environment variables not set in Supabase

**Solution:**
1. Go to Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add all three variables: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET`
3. Redeploy function
4. Hard refresh app (Ctrl+Shift+R)

---

## ✅ Quick Checklist

- [ ] Added Cloudinary credentials to Supabase Edge Function Secrets
- [ ] Deployed `sign-cloudinary-upload` function
- [ ] Function shows as "Active" in Supabase Dashboard
- [ ] Tested function response in browser console
- [ ] Code changes applied to all upload components
- [ ] Hard refresh app (Ctrl+Shift+R)
- [ ] Test image upload - should work! ✅

---

## 📖 What Changed in Code

### Before (Unsigned - Had CORS Errors):
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', uploadPreset);
// No signature = anyone can upload ❌
```

### After (Edge Function - Secure):
```typescript
// Get signature from Edge Function
const signResponse = await fetch(
  `${supabaseUrl}/functions/v1/sign-cloudinary-upload`,
  { method: 'POST', headers: {...} }
);
const { signature, timestamp, cloud_name } = await signResponse.json();

// Upload with signature = only authorized app can upload ✅
const formData = new FormData();
formData.append('file', file);
formData.append('upload_preset', uploadPreset);
formData.append('signature', signature);
formData.append('timestamp', timestamp);
```

---

## 🔗 Useful Links

- Supabase Edge Functions Docs: https://supabase.com/docs/guides/functions
- Cloudinary API Reference: https://cloudinary.com/documentation/upload_api
- Signed Uploads: https://cloudinary.com/documentation/upload_api#signed_uploads

---

**Your app is now secure and ready to handle image uploads! 🎉**

If you encounter any issues, check the browser console (F12) for detailed error messages.
