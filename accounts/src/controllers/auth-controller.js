const authService = require('../services/auth-service');
const { handleErrors } = require('../util/app-errors');
const { NO_CONTENT } = require('../util/constants');
const logger = require('../util/logger');

async function createToken(req, res) {
  logger.info('generating user token');
  try {
    const tokenObj = await authService.createToken(req.body);
    res.json(tokenObj);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode).json({ errors: errors.messages });
  }
}

async function authenticateUser(req, res) {
  logger.info('authenticating user');
  try {
    await authService.authenticateUser(req.body);
    res.status(NO_CONTENT).send();
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode).json({ errors: errors.messages });
  }
}

module.exports = {
  createToken,
  authenticateUser,
};
