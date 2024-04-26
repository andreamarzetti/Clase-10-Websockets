// app.js
import express from "express";
import http from "http";
import path from "path";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import session from 'express-session';
import productsRouter from "./src/routes/products.routes.js"; // el router de productos que faltaba
import sessionRouter from "./src/routes/ressesion.routes.js"; // el nuevo router para login y registro
import MongoStore from "connect-mongo";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.resolve();

// URL de conexión a tu base de datos en MongoDB Atlas
const uri = "mongodb+srv://AndreaMarzetti:PNC3sKkQ69d61Rhg@cluster1.ecdutkg.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster1";

// Conexión a la base de datos
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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
app.use("/products", productsRouter);

// Configuración de express-session con almacenamiento en MongoDB
// Configuración de express-session con almacenamiento en MongoDB
const store = MongoStore.create({
    mongoUrl: "mongodb+srv://AndreaMarzetti:PNC3sKkQ69d61Rhg@cluster1.ecdutkg.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster1",
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 15,
});

app.use(session({
    store: store,
    secret: "PNC3sKkQ69d61Rhg",
    resave: false,
    saveUninitialized: false
}));


// Usar las rutas de login y registro
app.use(sessionRouter);

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
