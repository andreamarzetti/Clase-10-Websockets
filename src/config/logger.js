// src/config/logger.js

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Definimos el formato personalizado de los logs
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Logger de desarrollo
const developmentLogger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console()
    ]
});

// Logger de producción
const productionLogger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

// Seleccionamos el logger adecuado según el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export default logger;
