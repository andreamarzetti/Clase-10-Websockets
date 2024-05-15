// Importa el modelo de Usuario
import User from '../dao/mongodb/models/User.js'; 

// Controlador para iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Busca al usuario por su email en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Verifica si la contraseña proporcionada coincide con la almacenada en la base de datos
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Inicia sesión y devuelve los datos del usuario
        req.session.user = user;
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para registrar un usuario
const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Verifica si el email ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Crea un nuevo usuario
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para cerrar sesión
const logout = async (req, res) => {
    try {
        // Destruye la sesión del usuario
        req.session.destroy();
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    login,
    register,
    logout
};
