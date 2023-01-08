const { Router } = require('express');
const {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} = require('../controllers/user-controller');
const requireAuth = require('../middleware/require-auth');

const router = Router();

router.get('/users', getUsers);
router.get('/user/:userId', requireAuth(['read']), getUser);
router.delete('/user/:userId', requireAuth(['delete']), deleteUser);
router.post('/user', createUser);
router.put('/user/:userId', requireAuth(['write']), updateUser);

module.exports = router;
