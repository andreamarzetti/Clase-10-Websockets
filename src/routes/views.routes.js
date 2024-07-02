import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getProducts } from '../controllers/products.controller.js';
import checkAuthMethod from '../utils/authMethods.js';

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('ok')
})

// Ruta para renderizar la página principal
router.get('/home', checkAuthMethod, async (req, res) => { // implementar checkAuthMethod en todo lo que necesite que un usuario este logueado ya sea
                                                            //  por github o por login normal

    console.log(req.user)

    try {
        const products = await getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }

});

// Ruta para renderizar la página de login
router.get('/login', (req, res) => {
    req.session.destroy();
    res.render('login');
});

// Ruta para renderizar la página de subir documentos (solo para usuarios autenticados)
router.get('/upload-documents', authMiddleware(['user']), (req, res) => {
    res.render('uploadDocuments', { uid: req.user.id });
});

export default router;
