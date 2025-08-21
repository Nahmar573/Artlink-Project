// server/middleware/authMiddleware.js
module.exports = (req, res, next) => {
  const userId = req.header('x-user-id');
  const userRole = req.header('x-user-role');

  if (!userId || !userRole) {
    return res.status(401).json({ message: 'Unauthorized: Missing authentication headers' });
  }

  req.userId = userId;
  req.userRole = userRole;
  next();
};
