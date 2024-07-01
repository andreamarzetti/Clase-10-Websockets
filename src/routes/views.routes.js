import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getProducts } from '../controllers/products.controller.js';

const router = express.Router();

// Ruta para renderizar la página principal
router.get('/home', async (req, res) => {
    try {
        const products = await getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para renderizar la página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para renderizar la página de subir documentos (solo para usuarios autenticados)
router.get('/upload-documents', authMiddleware(['user']), (req, res) => {
    res.render('uploadDocuments', { uid: req.user.id });
});

export default router;
