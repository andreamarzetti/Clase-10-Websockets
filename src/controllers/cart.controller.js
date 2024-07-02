// src/controllers/cart.controller.js
import Cart from '../models/CartModel.js';
import Product from '../models/ProductModel.js';
import logger from '../config/logger.js';

export async function addToCart(req, res) {
    try {
        console.log(req.user); // Verifica el contenido de req.user
        const user = req.user;
        const product = await Product.findById(req.body.productId);

        if (user.role === 'premium' && String(product.owner) === String(user._id)) {
            return res.status(400).send({ status: 'error', message: 'You cannot add your own product to the cart.' });
        }

        let cart = await Cart.findOne({ user: user._id });

        if (!cart) {
            cart = new Cart({ user: user._id, products: [] });
        }

        const existingProductIndex = cart.products.findIndex(item => String(item.product) === String(product._id));

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        await cart.save();

        res.send({ status: 'success', message: 'Product added to cart successfully.' });
    } catch (error) {
        logger.error('Error adding to cart:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}

export async function getCart(req, res) {
    try {
        console.log(req.user); // Verifica el contenido de req.user
        const user = req.user;
        const cart = await Cart.findOne({ user: user._id }).populate('products.product');

        if (!cart) {
            return res.render('cart', { products: [] });
        }

        res.render('cart', { products: cart.products });
    } catch (error) {
        logger.error('Error retrieving cart:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}
