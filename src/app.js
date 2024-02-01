import express from "express";
import path from "path";
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

// Configuración del motor de Handlebars
app.engine("handlebars" , exphbs.engine());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

const server = app.listen(8080, () => console.log("Server running in port 8080"));
