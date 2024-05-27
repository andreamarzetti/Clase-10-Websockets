// src/dao/mongodb/ProductDAO.js

import ProductModel from '../dao/mongodb/models/ProductModel.js';

class ProductDAO {
    async getProducts(limit = 10, page = 1, sort = {}, query = {}) {
        const skip = (page - 1) * limit;
        return await ProductModel.find(query)
                                 .sort(sort)
                                 .skip(skip)
                                 .limit(limit);
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async addProduct(productData) {
        const newProduct = new ProductModel(productData);
        return await newProduct.save();
    }

    async updateProduct(productId, productData) {
        return await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
    }

    async deleteProduct(productId) {
        await ProductModel.findByIdAndDelete(productId);
    }
}

export default new ProductDAO();
