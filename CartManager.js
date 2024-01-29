import fs from 'fs';

class CartManager {
    constructor() {
        this.carts = this.loadCarts();
    }

    getCarts() {
        return this.carts;
    }

    getCartProducts(cartId) {
        const foundCart = this.carts.find((cart) => cart.id === cartId);

        if (!foundCart) {
            throw new Error('Carrito no encontrado. ID inválido.');
        }

        return foundCart.products;
    }

    addProductToCart(cartId, productId, quantity) {
        const foundCart = this.carts.find((cart) => cart.id === cartId);

        if (!foundCart) {
            throw new Error('Carrito no encontrado. ID inválido.');
        }

        const existingProduct = foundCart.products.find((p) => p.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            foundCart.products.push({ product: productId, quantity });
        }

        this.saveCarts();
    }

    saveCarts() {
        try {
            fs.writeFileSync('carts.json', JSON.stringify(this.carts, null, 2));
        } catch (error) {
            throw new Error('Error al guardar los carritos en el archivo.');
        }
    }

    loadCarts() {
        try {
            const data = fs.readFileSync('carts.json', 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

export default CartManager;
