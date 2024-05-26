// src/dto/ProductDTO.js

class ProductDTO {
    constructor({ _id, title, description, price, thumbnail, code, stock }) {
        this.id = _id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

export default ProductDTO;
