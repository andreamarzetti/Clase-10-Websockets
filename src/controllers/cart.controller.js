// src/controllers/cart.controller.js
import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';
import logger from '../config/logger.js';

export async function addToCart(req, res) {
    try {
        const user = req.user;
        const product = await Product.findById(req.body.productId);

        // Verificar si el producto pertenece al usuario premium
        if (user.role === 'premium' && String(product.owner) === String(user._id)) {
            return res.status(400).send({ status: 'error', message: 'You cannot add your own product to the cart.' });
        }

        // Buscar el carrito del usuario
        let cart = await Cart.findOne({ user: user._id });

        // Si el usuario no tiene un carrito, crear uno nuevo
        if (!cart) {
            cart = new Cart({ user: user._id, products: [] });
        }

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(item => String(item.product) === String(product._id));

        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, aumentar su cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({ product: product._id, quantity: 1 });
        }

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.send({ status: 'success', message: 'Product added to cart successfully.' });
    } catch (error) {
        logger.error('Error adding to cart:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}
