// Diccionario de errores
const errorDictionary = {
    productCreationError: 'Error al crear el producto.',
    addToCartError: 'Error al agregar el producto al carrito.',
    authenticationError: 'Error de autenticación.',
    validationError: 'Error de validación de datos.',
    // Agrega más errores según sea necesario
};

// Middleware para manejar errores
export function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    const errorCode = err.code || 500; // Código de error predeterminado si no se proporciona uno
    const errorMessage = errorDictionary[err.type] || 'Error interno del servidor';
    res.status(errorCode).json({ error: errorMessage });
}


