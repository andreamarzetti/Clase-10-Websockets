import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import ProductManager from "../ProductManager";

const app = express();
const __dirname = path.resolve();

app.engine("handlebars", handlebars());
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "handlebars");

const productManager = new ProductManager();

app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { products: productManager.getProducts() });
});

const server = app.listen(8080, () => console.log("Server running in port 8080"));
