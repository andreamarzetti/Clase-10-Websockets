import express from "express";
const router = express.Router();
import ProductManager from "../dao/mongodb/manager/ProductManager.js";

const productManagerInstance = new ProductManager();

router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const result = await productManagerInstance.getProducts(limit, page, sort, query);
        
        const totalPages = Math.ceil(result.totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevPage = hasPrevPage ? page - 1 : null;
        const prevLink = hasPrevPage ? `/products?page=${prevPage}&limit=${limit}` : null;
        const nextLink = hasNextPage ? `/products?page=${nextPage}&limit=${limit}` : null;

        const response = {
            status: "success",
            payload: result.products,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };

        res.send(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({
            status: "error",
            message: 'Error interno del servidor'
        });
    }
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
