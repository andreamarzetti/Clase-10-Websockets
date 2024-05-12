import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT || 8080,
    sessionSecret: process.env.SESSION_SECRET || "8e4c3c993a8a806dbcf5aedad7cad186779edfc0",
    githubClient: process.env.GITHUB_CLIENT,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    mongoURI: process.env.MONGODB_URI,
    callbackURL: process.env.CALLBACK_URL,
};

