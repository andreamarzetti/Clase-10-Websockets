// test/routes/product.router.test.js
import {expect} from 'chai';
import app from '../../app.js';
import Product from '../../src/models/ProductModel.js';

//chai.use(chaiHttp);

describe('Products API', () => {
    let productId;

    // Test para crear un producto
    it('should create a new product', (done) => {
        const product = {
            title: 'Test Product',
            description: 'A product for testing',
            price: 100,
            stock: 50
        };

        chai.request(app)
            .post('/api/products')
            .send(product)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Product');
                productId = res.body._id;
                done();
            });
    });

    // Test para obtener un producto por ID
    it('should get a product by ID', (done) => {
        chai.request(app)
            .get(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Test Product');
                done();
            });
    });

    // Test para actualizar un producto
    it('should update a product', (done) => {
        const updatedProduct = {
            title: 'Updated Test Product'
        };

        chai.request(app)
            .put(`/api/products/${productId}`)
            .send(updatedProduct)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', 'Updated Test Product');
                done();
            });
    });

    // Test para eliminar un producto
    it('should delete a product', (done) => {
        chai.request(app)
            .delete(`/api/products/${productId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Product deleted successfully.');
                done();
            });
    });
});
