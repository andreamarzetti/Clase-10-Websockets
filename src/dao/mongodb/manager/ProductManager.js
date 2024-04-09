// ProductManager.js
import ProductModel from '../models/ProductModel.js';

class ProductManager {
    async getProducts(limit = 10, page = 1, sort = {}, query = {}) {
        const skip = (page - 1) * limit;
        const products = await ProductModel.find(query)
                                           .sort(sort)
                                           .skip(skip)
                                           .limit(limit);
        return products;
    }

    async addProduct(title, description, price, thumbnails, stock) {
        const newProduct = new ProductModel({ title, description, price, thumbnails, stock });
        return await newProduct.save();
    }

    // Otros métodos para actualizar, eliminar, etc.
}

export default ProductManager;
