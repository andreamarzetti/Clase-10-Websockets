import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para renderizar la página principal
router.get("/", async (req, res) => {
    res.render("home");
});

// Ruta para renderizar la página de login
router.get("/login", (req, res) => {
    res.render("login");
});

// Ruta para renderizar la página de subir documentos (solo para usuarios autenticados)
router.get('/upload-documents', authMiddleware(['user']), (req, res) => {
    res.render('uploadDocuments', { uid: req.user.id });
});

export default router;
