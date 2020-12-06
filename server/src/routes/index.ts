import { Router } from 'express';

import { validateUser } from '../middleware';

import userRouter from './user.route';
import tagsRouter from './tags.route';

const router = Router();

router.use('/user', userRouter);
router.use('/tags', validateUser, tagsRouter);

export default router;
