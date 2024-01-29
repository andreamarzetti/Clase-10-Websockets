import express from "express";
import path from "path";
import handlebars from "handlebars";
import exphbs from "express-handlebars";
import ProductManager from "../ProductManager.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/products", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const productManagerInstance = new ProductManager();
    const productos = productManagerInstance.getProducts(limit);
    res.send(productos);
});

app.get("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    try {
        const productManagerInstance = new ProductManager();
        const product = productManagerInstance.getProductById(productId);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado.' });
    }
});

app.get("/", (req, res) => {
    // Agregar lógica para visualizar home.handlebars
    res.render("home");
});

app.get("/realtimeproducts", (req, res) => {
    const productManagerInstance = new ProductManager();
    res.render("realTimeProducts", { products: productManagerInstance.getProducts() });
});

// Configuración del motor de Handlebars
app.engine("handlebars" , handlebars.engine);
app.engine("handlebars", exphbs());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

const server = app.listen(8080, () => console.log("Server running in port 8080"));
