// src/config/helmet.config.js

export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://jsonplaceholder.typicode.com", "https://cdn.jsdelivr.net"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtu.be"],
      frameAncestors: ["'self'"],
      fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"],
    },
  },
  
  crossOriginEmbedderPolicy: false,
};