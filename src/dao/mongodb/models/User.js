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
    enum: ['admin', 'user'], // Define los roles permitidos
    default: 'user' // Establece el rol por defecto como 'user'
  }
});

const User = mongoose.model('User', userSchema);

export default User;
