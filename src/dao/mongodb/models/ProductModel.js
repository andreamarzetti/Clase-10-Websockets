// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    stock: Number,
    thumbnails: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User para el propietario del producto
        default: null // Por defecto, el producto no tiene propietario
    }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
