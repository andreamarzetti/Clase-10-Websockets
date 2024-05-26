// src/routes/carts.router.js

import express from "express";
import CartService from "../services/CartService.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para listar los productos de un carrito específico
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await CartService.getCart(cartId);
        res.send(cart);
    } catch (error) {
        res.status(404).send({ error: 'Carrito no encontrado.' });
    }
});

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
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

// Ruta para eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        await CartService.removeProductFromCart(cartId, productId);
        res.send({ message: 'Producto eliminado del carrito exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al eliminar el producto del carrito.' });
    }
});

// Ruta para actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
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

// Ruta para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        await CartService.removeAllProductsFromCart(cartId);
        res.send({ message: 'Todos los productos del carrito han sido eliminados exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al eliminar los productos del carrito.' });
    }
});

// Implementación de la ruta para finalizar el proceso de compra
router.post("/:cid/purchase", authMiddleware(['user']), async (req, res) => {
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
