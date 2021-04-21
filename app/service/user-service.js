/*
 * This service module handles the api calls from the path of "/user"
 */


// Dependency

const userService = {};

userService.methodHandler = function(data, callback) {
    userService[data.method](data, callback)
}

userService.post = function(data, callback) {
    console.log("Post get");
    callback(200);
};

userService.get = function(data, callback) {
    console.log("Get get");
    callback(200);
};

userService.put = function(data, callback) {
    console.log("PUT get");
    callback(200);

};

userService.delete = function(data, callback) {
    console.log("Delete get");
    callback(200);

};

module.exports = userService;