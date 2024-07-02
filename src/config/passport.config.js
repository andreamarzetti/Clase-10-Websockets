import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import User from "../dao/mongodb/models/User.js";
import config from './config.js';
import CartModel from '../dao/mongodb/models/CartModel.js';

function initializePassport() {
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado.' });
            }

            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liy6573845VpMnDx",
        clientSecret: "8e4c3c993a8a806dbcf5aedad7cad186779edfc0",
        callbackURL: `http://localhost:8080/api/session/githubcallback`
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile._json.email });
                if (!user) {
                    const cart = new CartModel();
                    const cartId = cart._id;
    
                    let newUser = {
                        firstname: profile._json.name,
                        lastname: "",
                        age: 18,
                        email: profile._json.email,
                        password: "",
                        cart: cartId,
                    };
    
                    let result = await new User(newUser).save();
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                console.error("Error in GitHub Strategy:", error);
                return done(error);
            }
        }));

    // Configurar la estrategia JWT
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'secret_jwt'
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}

export default initializePassport;

