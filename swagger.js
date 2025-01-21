const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Deskify API Documentation',
        version: '1.0.0',
        description: 'API documentation for managing applications',
    },
    servers: [
        {
            url: 'https://deskify-api.vercel.app',
            description: 'Development Server',
        }
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
