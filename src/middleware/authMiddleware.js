// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

const authMiddleware = (roles) => (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
