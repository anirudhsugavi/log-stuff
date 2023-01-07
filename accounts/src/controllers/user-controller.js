const userService = require('../services/user-service');
const { handleErrors } = require('../util/app-errors');
const logger = require('../util/logger');

const getUsers = (_, res) => {
  // todo
  res.json({ message: 'get users coming right up' });
};

async function getUser(req, res) {
  logger.info('requested get user');
  try {
    const user = await userService.getUser({ _id: req.params.userId });
    user.password = undefined;
    res.json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode).json({ errors: errors.messages });
  }
}

const deleteUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

async function createUser(req, res) {
  logger.info('requested create user');
  try {
    const { createAccount, ...newUser } = req.body;
    const user = await userService.createUser({ user: newUser, createAccount });
    user.password = undefined;
    res.json(user);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode).json({ errors: errors.messages });
  }
}

const updateUser = (req, res) => {
  // todo
  console.log(req.body);
  res.json({ message: 'update user coming right up' });
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
};
