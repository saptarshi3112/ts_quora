
import { Router } from 'express';

import {
  UserController
} from '../controllers';

const router = Router();

router.post('/login', UserController.userLogin);
router.post('/register', UserController.userRegister);
router.post('/verify', UserController.userVerification);

export default router;
