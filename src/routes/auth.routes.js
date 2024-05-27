// src/routes/auth.routes.js
import express from 'express';
import { sendResetPasswordEmail, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sendResetPasswordEmail', sendResetPasswordEmail);
router.post('/resetPassword', resetPassword);

export default router;
