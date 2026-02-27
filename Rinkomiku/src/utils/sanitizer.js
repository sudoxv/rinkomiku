import xss from 'xss';

export const sanitize = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any script tags and dangerous HTML
  return xss(input, {
    whiteList: {}, // No HTML tags allowed
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
  });
};

export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return html;
  
  // Allow basic formatting but strip scripts
  return xss(html, {
    whiteList: {
      p: [],
      br: [],
      b: [],
      i: [],
      em: [],
      strong: []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style']
  });
};