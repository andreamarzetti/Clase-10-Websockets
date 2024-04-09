import express from "express";
const router = express.Router();
import CartManager from "../dao/mongodb/manager/CartManager.js";

const cartManagerInstance = new CartManager();

// Ruta para listar los productos de un carrito específico
router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        // Modificar para traer todos los productos completos mediante un "populate"
        const cart = await cartManagerInstance.getCart(cartId);
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
        await cartManagerInstance.addProductToCart(cartId, productId, quantity);
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
        await cartManagerInstance.removeProductFromCart(cartId, productId);
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
        await cartManagerInstance.updateProductQuantity(cartId, productId, quantity);
        res.send({ message: 'Cantidad de producto actualizada exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al actualizar la cantidad del producto en el carrito.' });
    }
});

// Ruta para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        await cartManagerInstance.removeAllProductsFromCart(cartId);
        res.send({ message: 'Todos los productos del carrito han sido eliminados exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al eliminar los productos del carrito.' });
    }
});

export default router;
