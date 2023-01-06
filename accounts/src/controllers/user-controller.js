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
    res.json({ status: 'success', user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode).json({ status: 'failure', errors: errors.messages });
  }
}

const deleteUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

const createUser = async (req, res) => {
  logger.info('requested create user');
  try {
    const { createAccount, ...newUser } = req.body;
    const user = await userService.createUser({ user: newUser, createAccount });
    user.password = undefined;
    res.json({ status: 'success', user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode)
      .json({ status: 'failure', errors: errors.messages });
  }
};

const updateUser = (req, res) => {
  // todo
  console.log(req.body);
  res.json({ message: 'update user coming right up' });
};

module.exports = {
  getUsers, getUser, deleteUser, createUser, updateUser,
};
