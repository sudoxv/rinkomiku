import rateLimit from 'express-rate-limit';

// Custom rate limiter untuk Vercel Hobby Plan
export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting untuk static files
    return req.path.startsWith('/css/') || req.path.startsWith('/js/');
  }
});

// Specific limiter untuk pencarian
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'Terlalu banyak pencarian. Silakan tunggu 1 menit.'
  }
});