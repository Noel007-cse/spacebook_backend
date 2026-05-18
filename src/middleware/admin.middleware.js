const verifyToken = require('./auth.middleware');

/**
 * Admin middleware — chains verifyToken first, then checks account_type.
 * Usage:  router.get('/route', verifyAdmin, handler)
 */
const verifyAdmin = (req, res, next) => {
  // First run the token verification
  verifyToken(req, res, (err) => {
    if (err) return; // verifyToken already sent the response

    // Then check admin role
    if (req.user.account_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
  });
};

module.exports = verifyAdmin;
