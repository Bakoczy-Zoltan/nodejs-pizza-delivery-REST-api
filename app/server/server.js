/**
 * Server module. Create a http and https server
 */

// Dependencies
const http = require('http');
const https = require('https');
const config = require('../service/config');
const path = require('path');
const userService = require('../service/user-service');
const fs = require('fs');
const helper = require('../service/helper');

const BASE_HTTP_URL = `http://localhost:${config.httpPort}/`;
const BASE_HTTPS_URL = `http://localhost:${config.httpsPort}/`;


const server = {};

server.httpServer = http.createServer(function(req, res) {
    server.unifiedServer(req, res, BASE_HTTP_URL);

});

server.httpsServerOption = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

server.httpsServer = https.createServer(this.httpsServerOption, function(req, res) {
    server.httpsServer(req, res);
});

server.unifiedServer = function(req, res, baseUrl) {
    const url = new URL(req.url, baseUrl);
    const trimmedPathName = url.pathname.replace(/^\/+|\/$/g, '');
    const method = req.method.toLowerCase();
    const headers = req.headers;
    const searchParams = url.searchParams;
    let payLoad = '';



    req.on('data', function(data) {
        // console.log(req.body, "body");
        payLoad += data;
    });


    req.on('end', function() {
        const payLoadObj = helper.parseJSONobject(payLoad);
        const reqData = {
            'method': method,
            'path': trimmedPathName,
            'headers': headers,
            'searchParamMap': searchParams,
            'payLoad': payLoadObj
        };

        // console.log(reqData);


        const serviceFunction =
            typeof(router[trimmedPathName]) === 'function' ? router[trimmedPathName] : router.notFound;

        serviceFunction(reqData, function(statCode, resPayLoad) {
            let statusCode = typeof(statCode) === 'number' ? statCode : 200;
            let respBodyData = helper.makeJSONobject(resPayLoad);

            res.setHeader = { 'Content-Type': 'application/json; charset=utf8' };
            res.writeHead(statusCode);
            res.end(respBodyData);
        });

    })

}

server.init = function() {
    server.httpServer.listen(config.httpPort, () => {
        console.log('\x1b[33m%s\x1b[0m', `HTTP-server is listening on PORT: ${config.httpPort}. Enviroment=${config.envName}`);
    });

    server.httpsServer.listen(config.httpsPort, () => {
        console.log('\x1b[35m%s\x1b[0m', `HTTPS-server is listening on PORT: ${config.httpsPort}. Enviroment=${config.envName}`);
    });
}

const router = {
    user: userService.methodHandler,
    token: {},
    notFound: function(data, callback) {
        console.log("not found");
        callback(404, {});
    }
};


module.exports = server;