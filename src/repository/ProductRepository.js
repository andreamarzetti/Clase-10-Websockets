// src/repository/ProductRepository.js

import ProductDAO from '../dao/ProductDAO.js';
import ProductDTO from '../dto/ProductDTO.js';

class ProductRepository {
    async getProducts(limit, page, sort, query) {
        const products = await ProductDAO.getProducts(limit, page, sort, query);
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(productId) {
        const product = await ProductDAO.getProductById(productId);
        return new ProductDTO(product);
    }

    async addProduct(productData) {
        const product = await ProductDAO.addProduct(productData);
        return new ProductDTO(product);
    }

    async updateProduct(productId, productData) {
        const product = await ProductDAO.updateProduct(productId, productData);
        return new ProductDTO(product);
    }

    async deleteProduct(productId) {
        await ProductDAO.deleteProduct(productId);
    }
}

export default new ProductRepository();
