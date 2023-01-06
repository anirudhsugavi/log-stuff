const { createNewUser, getUserById } = require('../services/user-service');
const { handleErrors } = require('../util/app-errors');

const getUsers = (_, res) => {
  // todo
  res.json({ message: 'get users coming right up' });
};

const getUser = getUserById;

const deleteUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

const createUser = async (req, res) => {
  const { createAccount, ...newUser } = req.body;
  try {
    const createdUser = await createNewUser({ user: newUser, createAccount });
    delete createdUser.password;
    res.json({ status: 'success', user: createdUser });
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
