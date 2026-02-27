import { Router } from 'express';
import {
  homePage,
  searchManga,
  mangaDetail,
  readChapter,
  toggleTheme,
  favoritesPage
} from '../controllers/mangaController.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes
router.get('/', homePage);
router.get('/search', searchLimiter, searchManga);
router.get('/detail', mangaDetail);
router.get('/chapter', readChapter);
router.get('/favorites', favoritesPage);
router.post('/api/theme', toggleTheme);

export default router;