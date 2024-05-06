import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import bcrypt from 'bcrypt';
import User from "../dao/mongodb/models/User.js";

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

    // Configurar la estrategia de autenticación de GitHub
    passport.use(new GitHubStrategy({
        clientID: "Iv23liy6573845VpMnDx",
        clientSecret: "8e4c3c993a8a806dbcf5aedad7cad186779edfc0",
        callbackURL: 'http://localhost:8080/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Verificar si el usuario ya existe en la base de datos
          let user = await User.findOne({ githubId: profile.id });
          if (user) {
            return done(null, user);
          }
  
          // Si el usuario no existe, crear uno nuevo
          user = new User({
            githubId: profile.id,
            username: profile.username
            // Puedes agregar más campos según lo necesites
          });
  
          // Guardar el nuevo usuario en la base de datos
          await user.save();
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        return done(null, user);
    });
}

export default initializePassport;
