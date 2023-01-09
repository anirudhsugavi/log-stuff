const userService = require('../services/user-service');
const logger = require('../util/logger');

const getUsers = (_, res) => {
  // todo
  res.json({ message: 'get users coming right up' });
};

async function getUser(req, res, next) {
  logger.info('requested get user');
  try {
    const user = await userService.getUser({ _id: req.params.userId });
    user.password = undefined;
    res.json(user);
  } catch (err) {
    next(err);
  }
}

const deleteUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

async function createUser(req, res, next) {
  logger.info('requested create user');
  try {
    const user = await userService.createUser(req.body);
    user.password = undefined;
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  logger.info('requested update user');
  try {
    const user = await userService.updateUser(req.params.userId, req.body);
    user.password = undefined;
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
};
