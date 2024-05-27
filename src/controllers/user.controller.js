// src/controllers/user.controller.js
import User from '../models/User.js';
import logger from '../config/logger.js';

export async function changeUserRole(req, res) {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'User not found.' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.send({ status: 'success', message: `User role updated to ${user.role}.` });
    } catch (error) {
        logger.error('Error changing user role:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}
