// src/routes/cart.router.js
import express from 'express';
import CartService from '../services/CartService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *       example:
 *         products:
 *           - productId: 60b5edbb4d1b2c0015d8d6e7
 *             quantity: 2
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: You cannot add your own product to the cart
 *       500:
 *         description: Internal server error
 */
router.post('/', addToCart);

/**
 * @swagger
 * /cart/{cid}:
 *   get:
 *     summary: Get a specific cart by id
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: The cart description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: The cart was not found
 */
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartService.getCart(cartId);
        res.send(cart);
    } catch (error) {
        res.status(404).send({ error: 'Carrito no encontrado.' });
    }
});

/**
 * @swagger
 * /cart/{cid}/product/{pid}:
 *   post:
 *     summary: Add a product to a specific cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       404:
 *         description: Error adding the product to the cart
 */
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const quantity = req.body.quantity || 1;
        await CartService.addProductToCart(cartId, productId, quantity);
        res.send({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al agregar el producto al carrito.' });
    }
});

/**
 * @swagger
 * /cart/{cid}/products/{pid}:
 *   delete:
 *     summary: Remove a product from a specific cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Error removing the product from the cart
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        await CartService.removeProductFromCart(cartId, productId);
        res.send({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al eliminar el producto del carrito.' });
    }
});

/**
 * @swagger
 * /cart/{cid}/products/{pid}:
 *   put:
 *     summary: Update the quantity of a product in a specific cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       404:
 *         description: Error updating the product quantity in the cart
 */
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    try {
        await CartService.updateProductQuantity(cartId, productId, quantity);
        res.send({ message: 'Cantidad de producto actualizada exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
});

/**
 * @swagger
 * /cart/{cid}:
 *   delete:
 *     summary: Remove all products from a specific cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: All products removed from cart successfully
 *       404:
 *         description: Error removing the products from the cart
 */
router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        await CartService.removeAllProductsFromCart(cartId);
        res.send({ message: 'Todos los productos del carrito han sido eliminados exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al eliminar los productos del carrito.' });
    }
});

/**
 * @swagger
 * /cart/{cid}/purchase:
 *   post:
 *     summary: Complete the purchase of a specific cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: cid
 *         schema:
 *           type: string
 *         required: true
 *         description: The cart id
 *     responses:
 *       200:
 *         description: Purchase completed successfully
 *       500:
 *         description: Error finalizing the purchase
 */
router.post('/:cid/purchase', authMiddleware(['user']), async (req, res) => {
    const cartId = req.params.cid;
    try {
        const result = await CartService.purchaseCart(cartId, req.user.email);

        if (result.unprocessedProducts.length > 0) {
            return res.status(200).json({
                message: 'Compra completada parcialmente. Algunos productos no pudieron ser procesados.',
                unprocessedProducts: result.unprocessedProducts
            });
        }

        res.status(200).json({ message: 'Compra completada exitosamente' });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ message: 'Error al finalizar la compra' });
    }
});

export default router;
