// test/routes/session.router.test.js
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app.js';
import User from '../../src/models/User.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Sessions API', () => {
    let token;

    before(async () => {
        // Crear un usuario para pruebas de sesión
        const user = new User({
            email: 'test@example.com',
            password: 'testpassword'
        });

        await user.save();
    });

    // Test para iniciar sesión
    it('should log in the user', (done) => {
        chai.request(app)
            .post('/api/sessions/login')
            .send({ email: 'test@example.com', password: 'testpassword' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            });
    });

    // Test para obtener la sesión del usuario actual
    it('should get the current user session', (done) => {
        chai.request(app)
            .get('/api/sessions/current')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('email', 'test@example.com');
                done();
            });
    });

    // Test para cerrar sesión
    it('should log out the user', (done) => {
        chai.request(app)
            .post('/api/sessions/logout')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Logged out successfully.');
                done();
            });
    });
});
