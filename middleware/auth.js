const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '00..';

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== ADMIN_PASSWORD) {
    return res.status(403).json({
      success: false,
      error: 'Invalid admin credentials'
    });
  }
  
  next();
};

// Optional: Use this middleware for protected routes
module.exports = { authenticateAdmin };