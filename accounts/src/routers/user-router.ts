import { Router } from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user-controller';

const router = Router();

router.get('/users', getUsers);
router.get('/user/:userId', getUser);
router.delete('/user/:userId', deleteUser);
router.post('/user', createUser);
router.put('/user', updateUser);

export default router;
