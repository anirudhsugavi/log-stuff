const getUsers = (_, res) => {
  // todo
  res.json({ message: 'get users coming right up' });
};

const getUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'get user coming right up' });
};

const deleteUser = (req, res) => {
  // todo
  console.log(req.params.userId);
  res.json({ message: 'delete user coming right up' });
};

const createUser = (req, res) => {
  // todo
  console.log(req.body);
  res.json({ message: 'create user coming right up' });
};

const updateUser = (req, res) => {
  // todo
  console.log(req.body);
  res.json({ message: 'update user coming right up' });
};

module.exports = {
  getUsers, getUser, deleteUser, createUser, updateUser,
};
