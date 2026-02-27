import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import xss from 'xss';

import mangaRoutes from './routes/mangaRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { securityMiddleware, preventScraping } from './middleware/security.js';
import { limiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(securityMiddleware);
app.use(preventScraping);
app.use(limiter);

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', mangaRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('index', {
    title: '404 - Halaman Tidak Ditemukan',
    path: '/404',
    theme: req.cookies.theme || 'light',
    error: 'Halaman yang Anda cari tidak ditemukan'
  });
});

// Error handler
app.use(errorHandler);

export default app;