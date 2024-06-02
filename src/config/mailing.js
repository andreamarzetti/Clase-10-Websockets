import nodemailer from "nodemailer";
import config from "./config.js"; 

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 8080,
    auth: {
        user: config.gmailUser,
        pass: config.gmailPass,
    }
});

export default transport;

