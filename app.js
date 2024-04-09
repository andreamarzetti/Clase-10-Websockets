import express from "express";
import http from "http";
import path from "path";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import session from 'express-session';
import FileStore from 'session-file-store'; // Importa el módulo de almacenamiento en archivos para express-session
import User from './src/dao/mongodb/models/User.js'; // Ajusta la ruta según la ubicación real de tu modelo de usuario

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.resolve();

// URL de conexión a tu base de datos en MongoDB Atlas
const uri = "mongodb+srv://AndreaMarzetti:PNC3sKkQ69d61Rhg@cluster1.ecdutkg.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster1";

// Conexión a la base de datos
mongoose.connect(uri)
  .then(() => {
    console.log('Conexión a MongoDB Atlas establecida');
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
  });

// Configuración del motor de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de express-session con almacenamiento en archivos
const FileStoreSession = FileStore(session);
app.use(session({
    store: new FileStoreSession(), // Usa el módulo de almacenamiento en archivos
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// Ruta para mostrar el formulario de login
app.get("/login", (req, res) => {
    res.render("login");
});

// Ruta para procesar la solicitud de login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Implementa la lógica para validar las credenciales del usuario
        const user = await User.findOne({ email });
        if (!user || !user.comparePassword(password)) {
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
app.get("/register", (req, res) => {
    res.render("register");
});

// Ruta para procesar la solicitud de registro
app.post("/register", async (req, res) => {
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

// Ruta para mostrar la página de productos
app.get("/products", (req, res) => {
    // Verifica si el usuario está autenticado
    if (!req.session.user) {
        // Si no está autenticado, redirige al usuario a la página de login
        return res.redirect("/login");
    }
    // Si está autenticado, muestra la página de productos con un mensaje de bienvenida
    res.render("products", { user: req.session.user });
});

// Ruta para cerrar sesión
app.get("/logout", (req, res) => {
    // Destruye la sesión del usuario y redirige al usuario a la página de login
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
        }
        res.redirect("/login");
    });
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
    console.log("A user connected");

    // Escuchar el evento para agregar un nuevo producto
    socket.on("addProduct", async (product) => {
        try {
            const { title, description, price, stock, thumbnails } = product;
            // Aquí va la lógica para agregar un producto (omitiendo por simplicidad)
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
