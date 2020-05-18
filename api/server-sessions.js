const express = require('express');

const apiRouter = require('./api-router-sessions');
const configureMiddleware = require('./configure-middleware-sessions');
const server = express();

configureMiddleware(server);
server.use('/api', apiRouter);

module.exports = server;