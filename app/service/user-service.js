/*
 * This service module handles the api calls from the path of "/user"
 */


// Dependency
const repositoryService = require('../integration/repository-handler');
const tokenService = require('../service/token-service');
const helper = require('../service/helper');
const validator = require('../service/validator');

const userService = {};

userService.methodHandler = function(data, callback) {
    userService[data.method](data, callback)
}

userService.post = function(data, callback) {
    console.log("Post get");
    let newUser = data.payLoad;
    newUser = validator.validateUser(newUser)
    const hashedPassword = helper.hashPassword(newUser.password);
    if (hashedPassword && newUser) {
        newUser.password = hashedPassword;
        repositoryService._saveNewEntity(data.payLoad, 'db', 'users', function(err, newUserData) {
            if (!err && newUserData) {
                callback(201, newUserData);
            } else {
                callback(500, err);
            }
        })
    } else {
        callback(400, { 'Error': 'Could not save user, has invalid fields' })
    }
};

userService.get = function(data, callback) {
    console.log("Get get");
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise
            .then(token => {
                if (token && token.userId == userId && token.expireDate > Date.now()) {
                    repositoryService._getEntityById(userId, 'db', 'users', function(err, userData) {
                        if (!err && userData && token.expireDate > Date.now()) {
                            delete userData.password;
                            callback(200, userData);
                        } else {
                            callback(500, err);
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Token invalid or not found' });
                }
            }).catch(err => callback(500, err));
    } else {
        callback(403);
    }
};

userService.put = function(data, callback) {
    console.log("PUT get");
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise.then(token => {
            if (token && token.userId == userId && token.expireDate > Date.now()) {
                repositoryService._updateEntity(userId, data.payLoad, 'db', 'users', function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, err);
                    }
                })
            } else {
                callback(400, { 'Error': 'Token invalid or not found' });
            }
        }).catch(err => callback(500, err));
    } else {
        callback(403);
    }

};

userService.delete = function(data, callback) {
    console.log("Delete get");
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token && token.expireDate > Date.now()) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise.then(token => {
            if (token && token.userId == userId) {
                repositoryService._deleteEntity(userId, 'db', 'users', function(err) {
                    console.log(err);
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, err);
                    }
                })
            } else {
                callback(400, { 'Error': 'Token invalid or not found' });
            }
        });
    } else {
        callback(403);
    }

};

module.exports = userService;