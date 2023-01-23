const { Router } = require('express');
const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  verifyUser,
} = require('../controllers/user-controller');
const requireAuth = require('../middleware/require-auth');

const router = Router();

router.get('/users', getUsers);
router.post('/user', createUser);
router.get('/user/verify', verifyUser);
router.get('/user/:userId', requireAuth(['read']), getUser);
router.delete('/user/:userId', requireAuth(['delete']), deleteUser);
router.put('/user/:userId', requireAuth(['write']), updateUser);

module.exports = router;
