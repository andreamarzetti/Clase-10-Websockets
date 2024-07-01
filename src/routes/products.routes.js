// src/routes/products.router.js
import express from 'express';
import ProductManager from '../dao/mongodb/manager/ProductManager.js';
import checkAuthMethod from '../utils/authMethods.js';
import jwt from 'jsonwebtoken'

const router = express.Router();
const productManagerInstance = new ProductManager();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           description: The product title
 *         description:
 *           type: string
 *           description: The product description
 *         price:
 *           type: number
 *           description: The product price
 *         stock:
 *           type: number
 *           description: The product stock
 *         owner:
 *           type: string
 *           description: The product owner
 *       example:
 *         title: Example Product
 *         description: This is an example product
 *         price: 100
 *         stock: 50
 *         owner: 60b5edbb4d1b2c0015d8d6e7
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all the products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of the products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', checkAuthMethod, async (req, res) => {

    console.log(req.user)

    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        const result = await productManagerInstance.getProducts(limit, page, sort, query);

        const totalPages = Math.ceil(result.totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevPage = hasPrevPage ? page - 1 : null;
        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;

        const response = {
            status: 'success',
            payload: result,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        };

        res.send(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productManagerInstance.getProductById(productId);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado.' });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        res.status(400).send({ error: 'Todos los campos son obligatorios.' });
        return;
    }

    try {
        const newProduct = await productManagerInstance.addProduct(title, description, code, price, stock, category, thumbnails);
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update a product by the id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const updatedFields = req.body;

    try {
        const updatedProduct = await productManagerInstance.updateProduct(productId, updatedFields);
        res.send(updatedProduct);
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado.' });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Remove a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */
router.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        await productManagerInstance.deleteProduct(productId);
        res.send({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado.' });
    }
});

export default router;
