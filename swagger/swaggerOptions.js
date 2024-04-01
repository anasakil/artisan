const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Artisan API',
      version: '1.0.0',
      description: 'API for Artisan application',
    },
  },
  apis: ['./routes/*.js', './swagger/*.yaml'], 
  
};

module.exports = options;
