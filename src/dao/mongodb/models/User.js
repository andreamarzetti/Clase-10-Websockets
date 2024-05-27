// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'premium', 'admin']
    },
    edad: {
        type: Number,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' // Asegúrate de que 'carts' sea el nombre correcto del modelo del carrito
    }
});

export default mongoose.model('User', userSchema);
