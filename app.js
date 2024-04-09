// app.js
import express from "express";
import http from "http";
import path from "path";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import ProductManager from "./src/dao/mongodb/manager/ProductManager.js"; // Ajusta la ruta según la ubicación real de ProductManager.js

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
app.use(express.static(path.join(__dirname, "public")));

// Definición de las demás rutas HTTP
app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/home", async (req, res) => {
    try {
        const productManagerInstance = new ProductManager();
        const products = await productManagerInstance.getProducts();
        res.render("home", { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get("/products", async (req, res) => {
    try {
        const productManagerInstance = new ProductManager();
        const products = await productManagerInstance.getProducts();
        res.render("products", { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get("/realtimeproducts", async (req, res) => {
    try {
        const productManagerInstance = new ProductManager();
        const products = await productManagerInstance.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
    console.log("A user connected");

    // Escuchar el evento para agregar un nuevo producto
    socket.on("addProduct", async (product) => {
        try {
            const { title, description, price, stock, thumbnails } = product;
            const productManagerInstance = new ProductManager();
            await productManagerInstance.addProduct(title, description, price, thumbnails, stock); // No es necesario pasar el ID, se generará automáticamente en el ProductManager

            // Emitir el evento updateProducts para actualizar ambas páginas
            io.emit("updateProducts", await productManagerInstance.getProducts());
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
