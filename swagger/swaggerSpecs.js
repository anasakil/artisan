const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./swaggerOptions');

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
