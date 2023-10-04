const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('./config');

const checkToken = (token) => jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

const signToken = (payload) => jwt.sign(payload, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

module.exports = {
  checkToken,
  signToken,
};
