import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: String, 
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: [String], required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencia al modelo User para el propietario del producto
        default: null // Por defecto, el producto no tiene propietario
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
