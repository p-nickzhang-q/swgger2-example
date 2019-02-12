'use strict';

var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
const JsonRefs = require('json-refs');
var serverPort = 8080;

// swaggerRouter configuration
var options = {
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
JsonRefs.resolveRefsAt('./swagger/swagger.json').then(swaggerConf => {

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerConf.resolved, function (middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));

    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());

    // Start the server
    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    });
  });
});


