const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ error: 'Invalid token, not logged in' });
  }
  
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
