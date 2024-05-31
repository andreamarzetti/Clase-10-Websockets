// test/routes/cart.router.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import Product from '../../src/dao/mongodb/models/ProductModel.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Carts API', () => {
    let cartId;
    let productId;

    before(async () => {
        // Crear un producto para agregar al carrito
        const product = new Product({
            title: 'Test Product',
            description: 'A product for testing',
            price: 100,
            stock: 50
        });

        const savedProduct = await product.save();
        productId = savedProduct._id;
    });

    // Test para crear un carrito
    it('should create a new cart', (done) => {
        chai.request(app)
            .post('/api/carts')
            .send({ userId: 'testUserId' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('userId', 'testUserId');
                cartId = res.body._id;
                done();
            });
    });

    // Test para agregar un producto al carrito
    it('should add a product to the cart', (done) => {
        chai.request(app)
            .post(`/api/carts/${cartId}/add`)
            .send({ productId, quantity: 1 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Product added to cart successfully.');
                done();
            });
    });

    // Test para obtener el carrito por ID
    it('should get a cart by ID', (done) => {
        chai.request(app)
            .get(`/api/carts/${cartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('_id', cartId);
                done();
            });
    });

    // Test para eliminar un carrito
    it('should delete a cart', (done) => {
        chai.request(app)
            .delete(`/api/carts/${cartId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Cart deleted successfully.');
                done();
            });
    });
});
