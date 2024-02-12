import express from "express";
import http from "http";
import path from "path";
import exphbs from "express-handlebars";
import mongoose from 'mongoose';
import { Server } from "socket.io"; // Importa Socket.io para el manejo de conexiones WebSocket
import ProductManager from "../ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Crea una instancia de Server para manejar WebSocket
const __dirname = path.resolve();

// URL de conexión a tu base de datos en MongoDB Atlas
const uri = "mongodb+srv://andreamarzetti8:<sanlorenzo888>@cluster0.o99mhzr.mongodb.net/ecommerce?retryWrites=true&w=majority";

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
app.use(express.static(path.join(__dirname, "public")));

// Definición de las rutas HTTP
app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/home", (req, res) => {
    const productManagerInstance = new ProductManager();
    const products = productManagerInstance.getProducts();
    res.render("home", { products });
});

app.get("/products", (req, res) => {
    const productManagerInstance = new ProductManager();
    const products = productManagerInstance.getProducts();
    res.render("products", { products });
});

app.get("/realtimeproducts", (req, res) => {
    const productManagerInstance = new ProductManager();
    res.render("realTimeProducts", { products: productManagerInstance.getProducts() });
});

// Manejo de conexiones WebSocket
io.on("connection", (socket) => {
    console.log("A user connected");

    // Escuchar el evento para agregar un nuevo producto
    socket.on("addProduct", (product) => {
        const { title, description, price, stock, thumbnails } = product;
        const id = productManagerInstance.generateUniqueId();
        productManagerInstance.addProduct(id, title, description, price, thumbnails, id, stock);

        // Emitir el evento updateProducts para actualizar ambas páginas
        io.emit("updateProducts", productManagerInstance.getProducts());
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
