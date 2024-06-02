// src/routes/users.router.js

import express from 'express';
import UserService from '../services/UserService.js';
import UserDTO from '../dto/UserDTO.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { changeUserRole, updateUserToPremium, uploadUserDocuments } from '../controllers/user.controller.js';
import multer from 'multer';

const router = express.Router();

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profile') {
      cb(null, 'uploads/profiles/');
    } else if (file.fieldname === 'product') {
      cb(null, 'uploads/products/');
    } else if (file.fieldname === 'document') {
      cb(null, 'uploads/documents/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send({ error: 'Error al crear el usuario.' });
  }
});

// Ruta para obtener un usuario por ID
router.get('/:uid', async (req, res) => {
  try {
    const user = await UserService.getUser(req.params.uid);
    res.json(user);
  } catch (error) {
    res.status(404).send({ error: 'Usuario no encontrado.' });
  }
});

// Ruta para actualizar un usuario por ID
router.put('/:uid', async (req, res) => {
  try {
    const user = await UserService.updateUser(req.params.uid, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar el usuario.' });
  }
});

// Ruta para eliminar un usuario por ID
router.delete('/:uid', async (req, res) => {
  try {
    await UserService.deleteUser(req.params.uid);
    res.send({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el usuario.' });
  }
});

// Ruta para obtener el usuario actual (autenticado)
router.get('/current', authMiddleware(['admin', 'user']), async (req, res) => {
  try {
    const user = await UserService.getUserById(req.user.id);
    const userDTO = new UserDTO(user);
    res.json(userDTO);
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar el usuario' });
  }
});

// Ruta para cambiar el rol del usuario a premium
router.patch('/premium/:uid', changeUserRole);

// Ruta para actualizar el usuario a premium si ha subido los documentos requeridos
router.put('/premium/:uid', updateUserToPremium);

// Ruta para subir documentos del usuario
router.post('/:uid/documents', upload.array('documents', 10), uploadUserDocuments);

export default router;
