import express from 'express';
import passport from 'passport';
import { sendResetPasswordEmail, resetPassword } from '../controllers/auth.controller.js'; 


const router = express.Router();

router.post('/sendResetPasswordEmail', sendResetPasswordEmail);
router.post('/resetPassword', resetPassword);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send({ error: 'Credenciales inválidas.' });
        }
        req.logIn(user, async (err) => {
            if (err) {
                return next(err);
            }
            user.last_connection = new Date();
            await user.save();
            return res.send({ message: 'Login exitoso.' });
        });
    })(req, res, next);
});

router.post('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.user.last_connection = new Date();
        req.user.save()
            .then(() => {
                req.logout();
                res.send({ message: 'Logout exitoso.' });
            })
            .catch(err => res.status(500).send({ error: 'Error interno del servidor.' }));
    } else {
        res.status(400).send({ error: 'No estás autenticado.' });
    }
});

export default router;
