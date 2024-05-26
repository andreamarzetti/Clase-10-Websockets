// src/dao/mongodb/CartDAO.js

import CartModel from './models/CartModel.js';

class CartDAO {
    async createCart(userId) {
        const newCart = new CartModel({ user: userId, products: [] });
        await newCart.save();
        return newCart;
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new Error('Producto no encontrado en el carrito');
        }
    }

    async removeAllProductsFromCart(cartId) {
        const cart = await CartModel.findById(cartId);
        cart.products = [];
        await cart.save();
        return cart;
    }
}

export default new CartDAO();
