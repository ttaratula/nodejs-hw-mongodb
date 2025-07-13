export function errorHandler(err, req, res, _next) {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: err.message, // або err.message || 'Unknown error'
    });
  }
  