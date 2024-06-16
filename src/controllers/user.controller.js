import User from '../dao/mongodb/models/User.js';
import logger from '../config/logger.js';

// Controlador para cambiar el rol de un usuario entre 'user' y 'premium'
export async function changeUserRole(req, res) {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'User not found.' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.send({ status: 'success', message: `User role updated to ${user.role}.` });
    } catch (error) {
        logger.error('Error changing user role:', error);
        res.status(500).send({ status: 'error', message: 'Internal server error.' });
    }
}

// Controlador para actualizar el usuario a 'premium' si ha subido los documentos requeridos
export const updateUserToPremium = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado.' });
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const uploadedDocuments = user.documents.map(doc => doc.name);

        const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

        if (!hasAllDocuments) {
            return res.status(400).send({ error: 'El usuario no ha terminado de procesar su documentación.' });
        }

        user.role = 'premium';
        await user.save();

        res.send({ message: 'Usuario actualizado a premium.' });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor.' });
    }
};

// Controlador para subir documentos de usuario
export const uploadUserDocuments = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado.' });
        }

        const files = req.files;
        files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        await user.save();

        res.send({ message: 'Documentos subidos exitosamente.' });
    } catch (error) {
        res.status(500).send({ error: 'Error interno del servidor.' });
    }
};
