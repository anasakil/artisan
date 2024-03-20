const { verifyToken } = require('../utils/jwtUtils');

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticate;
