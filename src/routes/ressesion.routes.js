// sessionRouter.js
import express from "express";
const router = express.Router();

import User from '../dao/mongodb/models/User.js'; // Ajusta la ruta según la ubicación real de tu modelo de usuario

// Ruta para mostrar el formulario de login
router.get("/login", (req, res) => {
    res.render("login");
});

// Ruta para procesar la solicitud de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Implementa la lógica para validar las credenciales del usuario
        const user = await User.findOne({ email });
        
        if (!user || !password) {
            throw new Error("Credenciales incorrectas");
        }
        
        // Inicia sesión y redirige al usuario a la página de productos
        req.session.user = user;
        res.redirect("/products");
    } catch (error) {
        console.error("Error de autenticación:", error);
        res.render("login", { error: "Credenciales incorrectas. Inténtalo de nuevo." });
    }
});

// Ruta para mostrar el formulario de registro
router.get("/register", (req, res) => {
    res.render("register");
});

// Ruta para procesar la solicitud de registro
router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Implementa la lógica para registrar al usuario en tu base de datos
        const newUser = new User({ email, password });
        await newUser.save();
        // Inicia sesión y redirige al usuario a la página de productos
        req.session.user = newUser;
        res.redirect("/products");
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.render("register", { error: "Error al registrar usuario. Inténtalo de nuevo." });
    }
});

export default router;
