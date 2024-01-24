// Importa los módulos utilizando require para mantener la consistencia con otros archivos
const express = require("express");
const app = express();
const path = require("path");
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager");
const productRouter = require("./products.routes");
const cartsRoutes = require("./carts.routes");

const productManagerInstance = new ProductManager();
const cartManagerInstance = new CartManager();

app.use(express.json());

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/products", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const productos = productManagerInstance.getProducts(limit);
    res.send(productos);
});

app.get("/products/:productId", (req, res) => {
    const productId = req.params.productId;
    try {
        const product = productManagerInstance.getProductById(productId);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: 'Producto no encontrado.' });
    }
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRoutes);

const server = app.listen(8080, () => {
    console.log("Aplicacion funcionando en el puerto 8080");
});
