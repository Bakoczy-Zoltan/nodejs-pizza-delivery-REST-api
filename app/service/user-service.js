/*
 * This service module handles the api calls from the path of "/user"
 */

const { connect } = require("node:http2");

// Dependency

const userService = {};

userService.methodHandler = function(data, callback) {
    userService[data.method](data, callback)
}

userService.post = function() {
    console.log("Post get")
};

userService.get = function() {
    console.log("Get get")
};

userService.put = function() {
    console.log("PUT get");
};

userService.delete = function() {
    console.log("Delete get");
};

module.exports = userService;