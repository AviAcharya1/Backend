const swaggerJsDoc = require('swagger-jsdoc');

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5000';
const options = {
  apis: ['./documentation/doc.yaml'],
  definition: {
    swagger: '2.0',
    info: {
      title: 'Auctions-App',
      version: '1.0.0',
      description: 'REST API for conducting Biddings auctions.',
      host: apiBaseUrl,
      basePath: '/',
      consumes: 'application/json',
      produces: 'application/json',
    },
  },
  server: [
    {
      url: apiBaseUrl,
    },
  ],
};

const spec = swaggerJsDoc(options);
module.exports = spec;
