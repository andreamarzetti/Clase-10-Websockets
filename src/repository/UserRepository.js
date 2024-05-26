// src/repository/UserRepository.js

import UserDAO from '../dao/mongodb/UserDAO.js';
import UserDTO from '../dto/UserDTO.js';

class UserRepository {
    async createUser(userData) {
        const user = await UserDAO.createUser(userData);
        return new UserDTO(user);
    }

    async getUser(userId) {
        const user = await UserDAO.getUserById(userId);
        return new UserDTO(user);
    }

    async updateUser(userId, userData) {
        const user = await UserDAO.updateUser(userId, userData);
        return new UserDTO(user);
    }

    async deleteUser(userId) {
        await UserDAO.deleteUser(userId);
    }
}

export default new UserRepository();
