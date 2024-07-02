import express from 'express';
import passport from 'passport';
import UserDAO from '../dao/UserDAO.js';
import CartModel from '../dao/mongodb/models/CartModel.js';
import User from '../dao/mongodb/models/User.js';

const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar la solicitud de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserDAO.getUserByEmail(email);

        if (!user || !password) {
            throw new Error('Credenciales incorrectas');
        }

        req.session.user = user;
        res.redirect('/home');
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.render('login', { error: 'Credenciales incorrectas. Inténtalo de nuevo.' });
    }
});

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para procesar la solicitud de registro
router.post('/register', async (req, res) => {
    const { email, password, firstname, lastname, age } = req.body;

    try {
        const cart = new CartModel();
        const newUser = new User({ email, password, firstname, lastname, age, cart });
        await newUser.save();
        req.session.user = newUser;
        res.redirect('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('register', { error: 'Error al registrar usuario. Inténtalo de nuevo.' });
    }
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    
    try {
        const user = await UserDAO.getUserByEmail(req.user.email);
        req.session.user = user;
        res.redirect('/home');
    } catch (error) {
        console.error('Error en la autenticación de GitHub:', error);
        if (!res.headersSent) {
            res.redirect('/login');
        }
    }
});

export default router;
