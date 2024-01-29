import fs from 'fs';

class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        if (this.products.length < 10) {
            this.addInitialProducts();
        }
    }

    getProducts(limit = null) {
        let productsToReturn = this.products;

        if (limit !== null && limit > 0 && limit <= this.products.length) {
            productsToReturn = this.products.slice(0, limit);
        }

        if (productsToReturn.length === 0) {
            return 'No hay productos disponibles actualmente.';
        }

        return productsToReturn;
    }

    addProduct(title, description, code, price, stock, category, thumbnails) {
        const existingProduct = this.products.find((p) => p.code === code);

        if (existingProduct) {
            throw new Error('El producto con este código ya existe. No se puede agregar.');
        }

        const newProduct = {
            id: this.generateUniqueId(), // Autogenerar el ID
            title,
            description,
            code,
            price,
            status: true, // Status es true por defecto
            stock,
            category,
            thumbnails,
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    generateUniqueId() {
        // Función para autogenerar un ID único
        return new Date().getTime().toString(36);
    }

    getProductById(id) {
        const foundProduct = this.products.find((p) => p.id === id);

        if (!foundProduct) {
            throw new Error('Producto no encontrado. ID inválido.');
        }

        return foundProduct;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado. ID inválido.');
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProducts();

        return this.products[productIndex];
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado. ID inválido.');
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
    }

    saveProducts() {
        try {
            fs.writeFileSync('products.json', JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error('Error al guardar los productos en el archivo.');
        }
    }

    loadProducts() {
        try {
            // Comentar o eliminar esta línea para evitar la lectura de products.json
            // const data = fs.readFileSync('products.json', 'utf8');
            // return JSON.parse(data);

            // En su lugar, retornar un arreglo vacío
            return [];
        } catch (error) {
            return [];
        }
    }

    addInitialProducts() {
        const initialProducts = [
            { id: '01', title: 'Remera 1', description: 'Descripción de la remera 1', price: 100, thumbnail: 'remera1.jpg', code: 'rem1', stock: 10 },
            { id: '02', title: 'Pantalón 1', description: 'Descripción del pantalón 1', price: 150, thumbnail: 'pantalon1.jpg', code: 'pan1', stock: 8 },
            { id: '03', title: 'Camisa 1', description: 'Descripción de la camisa 1', price: 90, thumbnail: 'camisa1.jpg', code: 'cam1', stock: 12 },
            { id: '04', title: 'Vestido 1', description: 'Descripción del vestido 1', price: 200, thumbnail: 'vestido1.jpg', code: 'vest1', stock: 5 },
            { id: '05', title: 'Sweater 1', description: 'Descripción del sweater 1', price: 120, thumbnail: 'sweater1.jpg', code: 'swe1', stock: 15 },
            { id: '06', title: 'Jean 1', description: 'Descripción del jean 1', price: 130, thumbnail: 'jean1.jpg', code: 'jean1', stock: 9 },
            { id: '07', title: 'Short 1', description: 'Descripción del short 1', price: 80, thumbnail: 'short1.jpg', code: 'short1', stock: 20 },
            { id: '08', title: 'Chaqueta 1', description: 'Descripción de la chaqueta 1', price: 180, thumbnail: 'chaqueta1.jpg', code: 'chaqueta1', stock: 7 },
            { id: '09', title: 'Bufanda 1', description: 'Descripción de la bufanda 1', price: 50, thumbnail: 'bufanda1.jpg', code: 'bufanda1', stock: 25 },
            { id: '10', title: 'Top 1', description: 'Descripción del top 1', price: 70, thumbnail: 'top1.jpg', code: 'top1', stock: 18 },
            // ... Otros productos
        ];

        initialProducts.forEach((product) => {
            this.addProduct(product.id, product.title, product.description, product.price, product.thumbnail, product.code, product.stock);
        });
    }
}

export default ProductManager;
