/*
 * This service module handles the api calls from the path of "/user"
 */


// Dependency
const repositoryService = require('../integration/repository-handler');

const userService = {};

userService.methodHandler = function(data, callback) {
    userService[data.method](data, callback)
}

userService.post = function(data, callback) {
    console.log("Post get");
    repositoryService._saveNewEntity(data.payLoad, 'db', 'users', function(err) {
        if (!err) {
            callback(201);
        } else {
            callback(500, err);
        }
    })
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
    const userId = data.searchParamMap.get('id');
    repositoryService._deleteEntity(userId, 'db', 'users', function(err) {
        console.log(err);
        if (!err) {
            callback(200);
        } else {
            callback(500, err);
        }
    })
};

module.exports = userService;