/**
 * The REST api runner. This module starts the server
 */

// Dependency
const server = require('./server/server');

const app = {};

app.init = function() {
    server.init();
}

app.init();

module.exports = app;