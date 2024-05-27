// src/controllers/auth.controller.js
import { generateResetToken, verifyResetToken } from '../utils/tokenUtils.js';
import transport from '../config/mailing.js';

export async function sendResetPasswordEmail(req, res) {
    const { email } = req.body;
    const token = generateResetToken(email);
    const resetLink = `http://localhost:3000/resetPassword?token=${token}`;

    await transport.sendMail({
        from: 'no-reply@yourapp.com',
        to: email,
        subject: 'Password Reset',
        html: `<p>Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`
    });

    res.send({ status: 'success', message: 'Reset password email sent.' });
}

// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { verifyResetToken } from '../utils/tokenUtils.js';

export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const payload = verifyResetToken(token);

    if (!payload) {
        return res.status(400).send({ status: 'error', message: 'Invalid or expired token.' });
    }

    const user = await User.findOne({ email: payload.email });

    if (!user) {
        return res.status(404).send({ status: 'error', message: 'User not found.' });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        return res.status(400).send({ status: 'error', message: 'New password must be different from the old password.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send({ status: 'success', message: 'Password reset successfully.' });
}

