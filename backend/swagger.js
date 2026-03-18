const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ticket Management System API',
            version: '1.0.0',
            description: 'API for managing tickets and users',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [path.join(__dirname, 'routes', '*.js'), path.join(__dirname, 'server.js')],
};

const specs = swaggerJsDoc(options);

console.log('--- Swagger Configuration ---');
console.log('API discovery paths:', options.apis);
console.log('Total paths discovered:', Object.keys(specs.paths || {}).length);
console.log('Paths:', Object.keys(specs.paths || {}));
console.log('------------------------------');

module.exports = {
    swaggerUi,
    specs
};
