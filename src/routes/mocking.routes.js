// Importa express y tu servicio de productos
import express from 'express';
import ProductService from '../services/ProductService.js';

// Crea un enrutador de express
const router = express.Router();

// Ruta para generar productos ficticios
router.get('/mockingproducts', async (req, res) => {
    try {
        // Genera 100 productos ficticios usando el servicio de productos
        const mockedProducts = await ProductService.generateMockedProducts(100);
        res.json(mockedProducts);
    } catch (error) {
        // Manejo de errores
        console.error('Error al generar productos ficticios:', error);
        res.status(500).json({ error: 'Error al generar productos ficticios' });
    }
});

// Exporta el enrutador
export default router;
