import komikuService from '../services/komikuService.js';
import { sanitize, sanitizeHtml } from '../utils/sanitizer.js';

export const homePage = (req, res) => {
  const theme = req.cookies.theme || 'light';
  
  res.render('index', {
    title: 'Rinkomiku - Baca Manga Online Gratis',
    path: '/',
    theme,
    recentManga: [],
    error: null
  });
};

export const searchManga = async (req, res) => {
  try {
    const query = sanitize(req.query.q || '');
    const theme = req.cookies.theme || 'light';
    
    if (!query) {
      return res.render('search', {
        title: 'Pencarian - Rinkomiku',
        path: '/search',
        theme,
        query: '',
        results: [],
        error: 'Masukkan kata kunci pencarian'
      });
    }

    const results = await komikuService.searchManga(query);
    
    res.render('search', {
      title: `Hasil pencarian: ${query} - Rinkomiku`,
      path: '/search',
      theme,
      query,
      results,
      error: results.length === 0 ? 'Tidak ada hasil ditemukan' : null
    });
  } catch (error) {
    console.error('Search controller error:', error);
    res.status(500).render('search', {
      title: 'Error - Rinkomiku',
      path: '/search',
      theme: req.cookies.theme || 'light',
      query: req.query.q || '',
      results: [],
      error: 'Terjadi kesalahan saat mencari manga'
    });
  }
};

export const mangaDetail = async (req, res) => {
  try {
    const url = sanitize(req.query.url || '');
    const theme = req.cookies.theme || 'light';
    
    if (!url) {
      return res.redirect('/');
    }

    const detail = await komikuService.getMangaDetail(url);
    
    if (!detail) {
      return res.render('detail', {
        title: 'Manga tidak ditemukan - Rinkomiku',
        path: '/detail',
        theme,
        manga: null,
        error: 'Manga tidak ditemukan'
      });
    }

    res.render('detail', {
      title: `${detail.title} - Rinkomiku`,
      path: '/detail',
      theme,
      manga: detail,
      error: null
    });
  } catch (error) {
    console.error('Detail controller error:', error);
    res.status(500).render('detail', {
      title: 'Error - Rinkomiku',
      path: '/detail',
      theme: req.cookies.theme || 'light',
      manga: null,
      error: 'Terjadi kesalahan saat mengambil detail manga'
    });
  }
};

export const readChapter = async (req, res) => {
  try {
    const url = sanitize(req.query.url || '');
    const theme = req.cookies.theme || 'light';
    
    if (!url) {
      return res.redirect('/');
    }

    const chapter = await komikuService.getChapterImages(url);
    
    if (!chapter || !chapter.images || chapter.images.length === 0) {
      return res.render('chapter', {
        title: 'Chapter tidak ditemukan - Rinkomiku',
        path: '/chapter',
        theme,
        chapter: null,
        error: 'Chapter tidak ditemukan'
      });
    }

    res.render('chapter', {
      title: `${chapter.title} - Rinkomiku`,
      path: '/chapter',
      theme,
      chapter,
      error: null
    });
  } catch (error) {
    console.error('Chapter controller error:', error);
    res.status(500).render('chapter', {
      title: 'Error - Rinkomiku',
      path: '/chapter',
      theme: req.cookies.theme || 'light',
      chapter: null,
      error: 'Terjadi kesalahan saat membaca chapter'
    });
  }
};

export const toggleTheme = (req, res) => {
  const currentTheme = req.cookies.theme || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  res.cookie('theme', newTheme, { 
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict'
  });
  
  res.json({ theme: newTheme });
};

export const favoritesPage = (req, res) => {
  const theme = req.cookies.theme || 'light';
  
  res.render('favorites', {
    title: 'Favorit Saya - Rinkomiku',
    path: '/favorites',
    theme,
    favorites: [],
    error: null
  });
};