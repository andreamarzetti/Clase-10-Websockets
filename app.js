// app.js

import express from 'express';
import http from 'http';
import path from 'path';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import productsRouter from './src/routes/products.routes.js'; 
import sessionRouter from './src/routes/session.routes.js';  
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './src/config/passport.config.js';
import config from './src/config/config.js';
import cors from 'cors';
import productsController from './src/controllers/products.controller.js';
import sessionController from './src/controllers/session.controller.js';
import transport from './src/config/mailing.js';
import logger from './src/config/logger.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import mockingRouter from './src/routes/mocking.routes.js';
import swaggerRouter from './src/config/swagger.js'; 
import usersRouter from './src/routes/users.router.js';
import authRouter from './src/routes/auth.routes.js';
import cartRouter from './src/routes/carts.routes.js'; // Importa las rutas del carrito


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.resolve();

initializePassport();
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

// Importa las rutas de las vistas y sesiones
import viewsRouter from './src/routes/views.routes.js';  
app.use('/', viewsRouter);
app.use('/api/session', sessionRouter); 

// URL de conexión a tu base de datos en MongoDB Atlas
const uri = 'mongodb+srv://AndreaMarzetti:PNC3sKkQ69d61Rhg@cluster1.ecdutkg.mongodb.net/ecommerce?retryWrites=true&w=majority';

// Conexión a la base de datos
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Conexión a MongoDB Atlas establecida');
  })
  .catch((error) => {
    logger.error('Error al conectar a MongoDB Atlas:', error);
  });

// Configuración del motor de Handlebars
app.engine('handlebars', exphbs.engine());
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/products', productsRouter);


// Configuración de express-session con almacenamiento en MongoDB
const store = MongoStore.create({
    mongoUrl: uri,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 15,
});

app.use(session({
    store: store,
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

// Usar las rutas de login y registro
app.use(sessionRouter);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            logger.error('Error al cerrar sesión:', err);
        }
        res.redirect('/login');
    });
});

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    logger.info('A user connected');

    // Escuchar el evento para agregar un nuevo producto
    socket.on('addProduct', async (product) => {
        try {
            const { title, description, price, stock, thumbnails } = product;
            // Aquí va la lógica para agregar un producto (omitiendo por simplicidad)
        } catch (error) {
            logger.error('Error al agregar producto:', error);
        }
    });

    socket.on('disconnect', () => {
        logger.info('A user disconnected');
    });
});


// Configuración del motor de plantillas Handlebars
app.engine('handlebars', exphbs.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Agrega esta opción
        allowProtoMethodsByDefault: true    // Agrega esta opción
    }
}));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(cors());
app.get('/test', (req, res) => {
    res.send('Respuesta!');
});

app.get('/mail', async (req, res) => {
    let result = await transport.sendMail({
        from: 'TestCoder <andreamarzetti9@gmail.com>',
        to: 'andreamarzetti9@gmail.com',
        subject: 'correo de prueba',
        html: `
            <div>
                <h1>¡Esto es un test, pero con imágenes, mira!</h1>
                <img src="cid:remera1"/>
            </div>
        `,
        attachments: [{
            filename: 'remera.jpg',
            path: '', 
            cid: 'remera1'
        }]
    });
    res.send({ status: 'success', result: 'Email Sent' });
});

// Rutas para los productos
app.get('/products', [], productsController.getProducts);
app.post('/products', [], productsController.createProduct);
app.get('/products/:id', [], productsController.getProductById);
app.put('/products/:id', [], productsController.updateProduct);
app.delete('/products/:id', [], productsController.deleteProduct);

// Rutas para la sesión
app.post('/login', [], sessionController.login);
app.post('/register', [], sessionController.register);
app.post('/logout', [], sessionController.logout);

app.get('/loggerTest', (req, res) => {
    logger.debug('Este es un log de debug');
    logger.http('Este es un log de http');
    logger.info('Este es un log de info');
    logger.warn('Este es un log de warning');
    logger.error('Este es un log de error');
    logger.fatal('Este es un log de fatal');
    res.send('Logger test finalizado');
});

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// Importa este middleware en tu archivo principal de la aplicación y úsalo como middleware global
app.use(errorHandler);

app.use('/api-docs', swaggerRouter);

const PORT = config.port;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
