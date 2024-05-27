// src/utils/tokenUtils.js
import jwt from 'jsonwebtoken';

const secret = 'your_jwt_secret'; 

export function generateResetToken(email) {
    return jwt.sign({ email }, secret, { expiresIn: '1h' });
}

export function verifyResetToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}
