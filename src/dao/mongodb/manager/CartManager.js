import CartModel from '../dao/mongodb/models/CartModel.js'; // Importar el modelo de carrito de MongoDB

class CartManager {

    // Método para crear un nuevo carrito
    async createCart(userId) {
        const newCart = new CartModel({ user: userId, products: [] });
        await newCart.save();
        return newCart;
    }

    async getCarts() {
        return await CartModel.find();
    }

    async getCartProducts(cartId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado. ID inválido.');
        }
        return cart.products;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado. ID inválido.');
        }

        const existingProduct = cart.products.find(p => p.product === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    // Otros métodos para actualizar, eliminar, etc.
}

export default CartManager;
