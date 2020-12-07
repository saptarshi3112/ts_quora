import { Router } from 'express';

import { UserController } from '../controllers';

const router = Router();

router.post('/login', UserController.userLogin);
router.post('/register', UserController.userRegister);
router.post('/logout', UserController.userLogout);

router.post('/verify', UserController.userVerification);

router.post('/requestPasswordChange', UserController.requestPasswordChange);
router.post('/changePassword', UserController.resetPassword);

export default router;
