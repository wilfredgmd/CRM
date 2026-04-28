export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // SQLite unique constraint error
  if (err.code === 'SQLITE_CONSTRAINT' || err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      error: 'Resource already exists',
      message: err.message,
    });
  }

  // SQLite foreign key error
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return res.status(400).json({
      error: 'Invalid reference',
      message: 'Referenced resource does not exist',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: err.message,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Please log in again',
    });
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
