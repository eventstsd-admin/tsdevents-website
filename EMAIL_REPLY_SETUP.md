# Email Reply Integration Setup

## Overview
This document outlines the setup for email reply functionality in the Inquiry Management system.

## Current Status
✅ **Frontend Reply UI**: Implemented in `InquiryManager.tsx`
✅ **Reply Modal**: Working with form validation
⏳ **Email Integration**: Ready for Resend API integration

## Frontend Implementation
The `InquiryManager` component now includes:
- Reply button on each inquiry card
- Reply modal with customer context
- Form validation and loading states
- Simulated email sending (shows success message)

## Future Email Integration

### 1. Create Supabase Edge Function
Create: `supabase/functions/send-email-reply/index.ts`

### 2. Environment Variables
Add to Supabase dashboard:
```
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Update Frontend
Replace the mock `handleReply` function in `InquiryManager.tsx` with:

```typescript
const handleReply = async () => {
  if (!replyingTo || !replyMessage.trim()) {
    toast.error('Please enter a reply message');
    return;
  }

  setSendingReply(true);
  try {
    const { data, error } = await supabase.functions.invoke('send-email-reply', {
      body: {
        to: replyingTo.email,
        subject: `Re: Your inquiry - TSD Events & Decor`,
        message: replyMessage,
        customerName: replyingTo.customer_name,
      }
    });

    if (error) throw error;

    toast.success(`Reply sent to ${replyingTo.customer_name}!`);
    setReplyingTo(null);
    setReplyMessage('');
  } catch (error) {
    console.error('Error sending reply:', error);
    toast.error('Failed to send reply. Please try again.');
  } finally {
    setSendingReply(false);
  }
};
```

### 4. Resend API Integration
The edge function will handle:
- Email template with TSD branding
- Customer name personalization
- Professional email formatting
- Error handling and delivery confirmation

### 5. Email Template Features
- Company branding header
- Customer name personalization
- Admin reply content
- Contact information footer
- Responsive HTML design

## Testing
1. **Frontend**: Reply modal and form validation
2. **Edge Function**: Deploy and test with mock emails
3. **Resend**: Test with real email delivery
4. **Integration**: End-to-end customer inquiry → admin reply → email delivery

## Security
- RLS policies for inquiries table
- Admin authentication required
- Rate limiting on email sending
- Email content sanitization