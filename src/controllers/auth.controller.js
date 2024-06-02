// src/controllers/auth.controller.js
import { sendEmail } from '../utils/emailUtils.js';
import { generateResetToken, verifyResetToken } from '../utils/tokenUtils.js';
import User from '../dao/mongodb/models/User.js';

export const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        const resetToken = generateResetToken(user._id);
        const resetLink = `${req.protocol}://${req.get('host')}/resetPassword?token=${resetToken}`;

        await sendEmail(email, 'Password Reset', `Use this link to reset your password: ${resetLink}`);

        res.send({ message: 'Email de restablecimiento de contraseña enviado.' });
    } catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const userId = verifyResetToken(token);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        user.password = newPassword; // Asegúrate de hashear la contraseña antes de guardarla
        await user.save();

        res.send({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        res.status(500).send({ message: 'Error interno del servidor.' });
    }
};
