export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  // Don't leak error details in production
  const error = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : message;

  res.status(status).render('index', {
    title: 'Error',
    path: '/error',
    theme: req.cookies.theme || 'light',
    error: error
  });
};