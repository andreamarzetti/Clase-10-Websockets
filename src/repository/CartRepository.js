// src/repository/CartRepository.js

import CartDAO from '../dao/CartDAO.js';
import CartDTO from '../dto/CartDTO.js';  

class CartRepository {
    async createCart(userId) {
        const cart = await CartDAO.createCart(userId);
        return new CartDTO(cart);
    }

    async getCart(cartId) {
        const cart = await CartDAO.getCartById(cartId);
        return new CartDTO(cart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartDAO.addProductToCart(cartId, productId, quantity);
        return new CartDTO(cart);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartDAO.removeProductFromCart(cartId, productId);
        return new CartDTO(cart);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartDAO.updateProductQuantity(cartId, productId, quantity);
        return new CartDTO(cart);
    }

    async removeAllProductsFromCart(cartId) {
        const cart = await CartDAO.removeAllProductsFromCart(cartId);
        return new CartDTO(cart);
    }
}

export default new CartRepository();
