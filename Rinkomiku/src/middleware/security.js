import xss from 'xss';
import { sanitize } from '../utils/sanitizer.js';

export const securityMiddleware = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }

  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    });
  }

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

export const preventScraping = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const accept = req.headers['accept'] || '';
  
  // Block common scraping tools
  const scrapingAgents = [
    'python', 'scrapy', 'curl', 'wget', 'bot', 'crawler',
    'spider', 'scraper', 'selenium', 'phantomjs', 'headless'
  ];
  
  const isScraping = scrapingAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  );
  
  // Check for missing or suspicious headers
  const hasBrowserHeaders = accept.includes('text/html') || accept.includes('application/xhtml+xml');
  
  if (isScraping || (!hasBrowserHeaders && !userAgent.includes('Mozilla'))) {
    return res.status(403).json({ 
      error: 'Akses ditolak. Silakan gunakan browser untuk mengakses situs ini.' 
    });
  }
  
  // Add random delay to prevent automated scraping (0-500ms)
  setTimeout(next, Math.floor(Math.random() * 500));
};