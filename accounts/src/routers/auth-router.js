const { Router } = require('express');
const { createToken, authenticateUser } = require('../controllers/auth-controller');

const router = Router();

router.post('/token', createToken);
router.post('/authenticate', authenticateUser);

module.exports = router;
