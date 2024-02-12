import express from "express";
const router = express.Router();
import ProductManager from "../dao/fileSystem/ProductManager.js";

const productManagerInstance = new ProductManager();

router.get("/", (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const productos = productManagerInstance.getProducts(limit);
    res.send(productos);
});

router.get("/:productId", (req, res) => {
    const productId = req.params.productId;
    try {
        const product = productManagerInstance.getProductById(productId);
        res.send(product);
    } catch (error) {
        res.status(404).send({ error: "Producto no encontrado." });
    }
});

router.post("/", (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
        res.status(400).send({ error: "Todos los campos son obligatorios." });
        return;
    }

    try {
        const newProduct = productManagerInstance.addProduct(title, description, code, price, stock, category, thumbnails);
        res.status(201).send(newProduct);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put("/:productId", (req, res) => {
    const productId = req.params.productId;
    const updatedFields = req.body;

    try {
        const updatedProduct = productManagerInstance.updateProduct(productId, updatedFields);
        res.send(updatedProduct);
    } catch (error) {
        res.status(404).send({ error: "Producto no encontrado." });
    }
});

router.delete("/:productId", (req, res) => {
    const productId = req.params.productId;

    try {
        productManagerInstance.deleteProduct(productId);
        res.send({ message: "Producto eliminado correctamente." });
    } catch (error) {
        res.status(404).send({ error: "Producto no encontrado." });
    }
});

export default router;
