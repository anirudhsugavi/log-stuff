const { Router } = require('express');
const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createToken,
  authenticateUser,
} = require('../controllers/user-controller');

const router = Router();

router.get('/users', getUsers);
router.get('/user/:userId', getUser);
router.delete('/user/:userId', deleteUser);
router.post('/user', createUser);
router.put('/user', updateUser);

router.post('/user/token', createToken);
router.post('/user/authenticate', authenticateUser);

module.exports = router;
