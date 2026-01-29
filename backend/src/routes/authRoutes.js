import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
// router.post('/google', googleLogin);

export default router;
