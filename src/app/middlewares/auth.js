const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authConfig = require('../../config/auth');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token[1], authConfig.secret);
    req.userId = decoded.id;
  } catch (err) {
    return req.status(401).json({ error: 'Token not provided' });
  }

  return next();
};
