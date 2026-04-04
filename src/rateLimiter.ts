// Rate limiting utility for frontend API calls
// Prevents spam and abuse

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
}

const DEFAULT_LIMITS = {
  contact: { maxRequests: 3, windowMs: 60000 }, // 3 per minute
  booking: { maxRequests: 2, windowMs: 60000 }, // 2 per minute
  inquiry: { maxRequests: 5, windowMs: 300000 }, // 5 per 5 minutes
  upload: { maxRequests: 10, windowMs: 60000 }, // 10 per minute
};

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: RateLimitConfig) {}

  isAllowed(key: string = "default"): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      // New window or expired - reset
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingTime(key: string = "default"): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }

  getRemainingRequests(key: string = "default"): number {
    const record = this.attempts.get(key);
    if (!record) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - record.count);
  }

  reset(key: string = "default"): void {
    this.attempts.delete(key);
  }

  resetAll(): void {
    this.attempts.clear();
  }
}

// Create rate limiters for different endpoints
export const contactFormLimiter = new RateLimiter(DEFAULT_LIMITS.contact);
export const bookingFormLimiter = new RateLimiter(DEFAULT_LIMITS.booking);
export const inquiryLimiter = new RateLimiter(DEFAULT_LIMITS.inquiry);
export const uploadLimiter = new RateLimiter(DEFAULT_LIMITS.upload);

// Usage example:
// if (!contactFormLimiter.isAllowed('user@email.com')) {
//   toast.error('Too many requests. Please wait before trying again.');
//   return;
// }
