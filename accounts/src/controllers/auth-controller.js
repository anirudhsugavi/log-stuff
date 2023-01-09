const authService = require('../services/auth-service');
const { NO_CONTENT } = require('../util/constants');
const logger = require('../util/logger');

async function createToken(req, res, next) {
  logger.info('generating user token');
  try {
    const tokenObj = await authService.createToken(req.body);
    res.json(tokenObj);
  } catch (err) {
    next(err);
  }
}

async function authenticateUser(req, res, next) {
  logger.info('authenticating user');
  try {
    await authService.authenticateUser(req.body);
    res.status(NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createToken,
  authenticateUser,
};
