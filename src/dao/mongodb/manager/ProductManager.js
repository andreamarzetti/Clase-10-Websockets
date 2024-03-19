import ProductModel from '../models/ProductModel.js';

class ProductManager {
    async getProducts(limit = null) {
        try {
            let query = ProductModel.find();
            if (limit !== null) {
                query = query.limit(limit);
            }
            return await query.exec();
        } catch (error) {
            throw new Error('Error al obtener los productos de la base de datos.');
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const newProduct = new ProductModel({ title, description, price, thumbnail, code, stock });
            return await newProduct.save();
        } catch (error) {
            throw new Error('Error al agregar el producto a la base de datos.');
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            throw new Error('Error al obtener el producto de la base de datos.');
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error('Producto no encontrado. ID inválido.');
            }
            Object.assign(product, updatedFields);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error al actualizar el producto en la base de datos.');
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);
            if (!product) {
                throw new Error('Producto no encontrado. ID inválido.');
            }
            return product;
        } catch (error) {
            throw new Error('Error al eliminar el producto de la base de datos.');
        }
    }

    // Otros métodos necesarios para manipular productos en la base de datos
}

export default ProductManager;
