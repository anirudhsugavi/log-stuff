const userService = require('../services/user-service');
const { UnauthorizedError } = require('../util/app-errors');
const { CREATED, NO_CONTENT } = require('../util/constants');
const logger = require('../util/logger');

const getUsers = (_, res) => {
  // todo: this is a super admin role request. probably will not do.
  res.json({ message: 'get users coming right up' });
};

async function getUser(req, res, next) {
  logger.info('requested get user');
  try {
    verifyAuthenticatedUser(req.userId, req.params.userId);
    const user = await userService.getUser({ _id: req.params.userId });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  logger.info('requested delete user');
  try {
    verifyAuthenticatedUser(req.userId, req.params.userId);
    await userService.deleteUser({ _id: req.params.userId });
    res.status(NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  logger.info('requested create user');
  try {
    const user = await userService.createUser(req.body);
    res.status(CREATED).location(`/user/${user._id}`).send();
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  logger.info('requested update user');
  try {
    verifyAuthenticatedUser(req.userId, req.params.userId);
    const user = await userService.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

function verifyAuthenticatedUser(authenticatedUserId, requestUserId) {
  if (authenticatedUserId !== requestUserId) {
    throw new UnauthorizedError({ description: 'authenticated user does not have access to this resource' });
  }
}

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
};
