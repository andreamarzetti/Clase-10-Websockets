const express = require("express");
const router = express.Router();
const CartManager = require("../CartManager"); // Ajusta la ruta según la estructura de tu proyecto

const cartManagerInstance = new CartManager();

// Ruta para listar los productos de un carrito específico
router.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    try {
        const cartProducts = cartManagerInstance.getCartProducts(cartId);
        res.send(cartProducts);
    } catch (error) {
        res.status(404).send({ error: 'Carrito no encontrado.' });
    }
});

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const quantity = req.body.quantity || 1;
        cartManagerInstance.addProductToCart(cartId, productId, quantity);
        res.send({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
        res.status(404).send({ error: 'Error al agregar el producto al carrito.' });
    }
});

module.exports = router;
