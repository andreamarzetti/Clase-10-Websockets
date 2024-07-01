// src/controllers/products.controller.js
import Product from '../dao/mongodb/models/ProductModel.js';
import User from '../dao/mongodb/models/User.js';
import logger from '../config/logger.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return (products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

export async function createProduct(req, res) {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 'premium' && user.role !== 'admin') {
            return res.status(403).send({ status: 'error', message: 'Only premium users can create products.' });
        }

        const newProduct = new Product({
            ...req.body,
            owner: user.role === 'premium' ? user._id : 'admin'
        });

        await newProduct.save();
        res.send({ status: 'success', message: 'Product created successfully.' });
    } catch (error) {
        logger.error('Error creating product:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        logger.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

export async function updateProduct(req, res) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        logger.error('Error updating product:', error);
        res.status(400).json({ message: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ status: 'error', message: 'Product not found.' });
        }

        const user = await User.findById(req.user._id);

        if (user.role !== 'admin' && String(product.owner) !== String(user._id)) {
            return res.status(403).send({ status: 'error', message: 'You do not have permission to delete this product.' });
        }

        await product.remove();
        res.send({ status: 'success', message: 'Product deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting product:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}

export default {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};