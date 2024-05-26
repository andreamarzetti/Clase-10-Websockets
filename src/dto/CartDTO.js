// src/dto/CartDTO.js

class CartDTO {
    constructor({ _id, user, products }) {
        this.id = _id;
        this.user = user;
        this.products = products.map(product => ({
            productId: product.product,
            quantity: product.quantity
        }));
    }
}

export default CartDTO;
