import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

class KomikuService {
  constructor() {
    this.baseUrl = 'https://komiku.org';
    this.axiosInstance = axios.create({
      timeout: 10000,
      httpsAgent: new https.Agent({ keepAlive: true }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache'
      }
    });
  }

  async searchManga(query) {
    try {
      if (!query || query.trim() === '') return [];

      const response = await this.axiosInstance.get(`${this.baseUrl}/`, {
        params: {
          s: query,
          post_type: 'manga'
        }
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.daftar .bge, .daftar .kan, .list-update .bge').each((i, el) => {
        const title = $(el).find('.judul2 a, h3 a').text().trim();
        const url = $(el).find('.judul2 a, h3 a').attr('href');
        const image = $(el).find('img').attr('src');
        const type = $(el).find('.tipe, .type').text().trim();
        
        if (title && title.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            title,
            url: url ? (url.startsWith('http') ? url : this.baseUrl + url) : null,
            image: image ? (image.startsWith('http') ? image : 'https:' + image) : null,
            type: type || 'Manga',
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Search error:', error.message);
      return [];
    }
  }

  async getMangaDetail(url) {
    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);

      const title = $('#Judul h1 span').first().text().trim() || $('h1.entry-title').text().trim();
      const cover = $('.ims img').attr('src') || $('.thumb img').attr('src');
      const author = $('.inftable tr:contains("Pengarang") td:last-child, .inftable tr:contains("Author") td:last-child').text().trim();
      const status = $('.inftable tr:contains("Status") td:last-child').text().trim();
      
      const genres = [];
      $('.genre li a, .genres a').each((i, el) => {
        const genre = $(el).text().trim();
        if (genre && !genre.includes('Genre')) genres.push(genre);
      });

      const synopsis = $('.desc, .sinopsis, .entry-content p').first().text().trim();

      const chapters = [];
      $('#daftarChapter tr, .chapter-list li, .clstyle li').each((i, el) => {
        if (i === 0 && $(el).is('tr')) return;
        
        const chapterEl = $(el).find('.judulseries a, .chapter-title a, a');
        const chapterTitle = chapterEl.text().trim();
        const chapterUrl = chapterEl.attr('href');
        const date = $(el).find('.tanggalseries, .date').text().trim();
        
        if (chapterTitle && chapterUrl) {
          chapters.push({
            title: chapterTitle,
            url: chapterUrl.startsWith('http') ? chapterUrl : this.baseUrl + chapterUrl,
            date: date || 'Unknown'
          });
        }
      });

      return {
        title,
        cover: cover ? (cover.startsWith('http') ? cover : 'https:' + cover) : null,
        author: author || 'Unknown',
        status: status || 'Ongoing',
        genres: [...new Set(genres)],
        synopsis: synopsis || 'No synopsis available',
        chapters: chapters.slice(0, 50),
        totalChapters: chapters.length
      };
    } catch (error) {
      console.error('Detail error:', error.message);
      return null;
    }
  }

  async getChapterImages(url) {
    try {
      const response = await this.axiosInstance.get(url);
      const $ = cheerio.load(response.data);

      const title = $('#Judul h1').text().trim() || $('h1.entry-title').text().trim();
      
      const images = [];
      $('#Baca_Komik img, .chapter-image img, .reader-area img').each((i, el) => {
        const imgUrl = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
        if (imgUrl && imgUrl.startsWith('http')) {
          images.push({
            url: imgUrl,
            page: i + 1
          });
        }
      });

      const prevChapter = $('a[aria-label="Prev"], a.prev, a:contains("Sebelumnya")').attr('href');
      const nextChapter = $('a[aria-label="Next"], a.next, a:contains("Selanjutnya")').attr('href');

      return {
        title,
        images,
        navigation: {
          prev: prevChapter ? (prevChapter.startsWith('http') ? prevChapter : this.baseUrl + prevChapter) : null,
          next: nextChapter ? (nextChapter.startsWith('http') ? nextChapter : this.baseUrl + nextChapter) : null
        }
      };
    } catch (error) {
      console.error('Chapter error:', error.message);
      return null;
    }
  }
}

export default new KomikuService();