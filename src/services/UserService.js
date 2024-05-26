// src/services/ProductService.js

import ProductRepository from '../repository/ProductRepository.js';

class ProductService {
    async getProducts(limit = 10, page = 1, sort = {}, query = {}) {
        return await ProductRepository.getProducts(limit, page, sort, query);
    }

    async getProductById(productId) {
        return await ProductRepository.getProductById(productId);
    }

    async addProduct(productData) {
        return await ProductRepository.addProduct(productData);
    }

    async updateProduct(productId, productData) {
        return await ProductRepository.updateProduct(productId, productData);
    }

    async deleteProduct(productId) {
        return await ProductRepository.deleteProduct(productId);
    }
}

export default new ProductService();
