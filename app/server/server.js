/**
 * Server module. Create a http and https server
 */

// Dependencies
const http = require('http');
const https = require('https');
const config = require('../service/config');
const path = require('path');

const BASE_HTTP_URL = `http://localhost:${config.httpPort}/`;
const BASE_HTTPS_URL = `http://localhost:${config.httpsPort}/`;


const server = {};

server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req, res, BASE_HTTP_URL);

});

server.httpsServer = https.createServer(function(req, res) {

});

server.unifiedServer = function(req, res, baseUrl) {
    const url = new URL(req.url, baseUrl);
    const trimmedPathName = url.pathname.replace(/^\/+|\/$/g, '');

}


server.init = function() {
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[33m%s\x1b[0m', `HTTP-server is listening on PORT: ${config.httpPort}. Enviroment=${config.envName}`);
    });

    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[35m%s\x1b[0m', `HTTPS-server is listening on PORT: ${config.httpsPort}. Enviroment=${config.envName}`);
    });
}


module.exports = server;