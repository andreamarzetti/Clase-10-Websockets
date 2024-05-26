// src/services/CartService.js

import CartRepository from '../repository/CartRepository.js';
import TicketService from './TicketService.js';
import ProductRepository from '../repository/ProductRepository.js';

class CartService {
    async createCart(userId) {
        return await CartRepository.createCart(userId);
    }

    async getCart(cartId) {
        return await CartRepository.getCart(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await CartRepository.addProductToCart(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await CartRepository.removeProductFromCart(cartId, productId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartRepository.updateProductQuantity(cartId, productId, quantity);
    }

    async removeAllProductsFromCart(cartId) {
        return await CartRepository.removeAllProductsFromCart(cartId);
    }

    async purchaseCart(cartId, purchaserEmail) {
        const cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const unprocessedProducts = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await ProductRepository.updateProduct(product.id, { stock: product.stock });
            } else {
                unprocessedProducts.push(item.product);
            }
        }

        await TicketService.createTicket(totalAmount, purchaserEmail);

        cart.products = cart.products.filter(item => unprocessedProducts.includes(item.product));
        await CartRepository.updateCart(cart.id, { products: cart.products });

        return { unprocessedProducts };
    }
}

export default new CartService();
