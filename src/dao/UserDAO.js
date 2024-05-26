// src/dao/mongodb/UserDAO.js

import UserModel from './models/UserModel.js';

class UserDAO {
    async createUser(userData) {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    }

    async getUserById(userId) {
        return await UserModel.findById(userId).populate('cart');
    }

    async updateUser(userId, userData) {
        return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
    }

    async deleteUser(userId) {
        await UserModel.findByIdAndDelete(userId);
    }
}

export default new UserDAO();
