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
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        userService[data.method](data, callback);
    } else {
        callback(405);
    }
}

userService.post = function(data, callback) {
    console.log("Post request on path:", data.path);
    let newUser = data.payLoad;
    newUser = validator.validateUser(newUser);

    const tokenPromise = tokenService._searchUserByEmailAndPassword({ email: newUser.email }, true);

    tokenPromise.then(user => {
        if (user) {
            callback(400, { 'Error': 'This email has already signed up' });
        } else {
            const hashedPassword = helper.hashPassword(newUser.password);
            if (hashedPassword && newUser) {
                newUser.password = hashedPassword;
                repositoryService._saveNewEntity(newUser, 'user', 'users', function(err, newUserData) {
                    if (!err && newUserData) {
                        callback(201, newUserData);
                    } else {
                        callback(500, err);
                    }
                })
            } else {
                callback(400, { 'Error': 'Could not save user, has invalid fields' })
            }
        }
    }).catch(err => callback(400, err));

};

userService.get = function(data, callback) {
    console.log("GET request on path:", data.path);
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise
            .then(token => {
                if (token && token.userId == userId && token.expireDate > Date.now()) {
                    repositoryService._getEntityById(userId, 'user', 'users', function(err, userData) {
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
    console.log("PUT request on path:", data.path);
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise.then(token => {
            if (token && token.userId == userId && token.expireDate > Date.now()) {
                repositoryService._updateEntity(userId, data.payLoad, 'user', 'users', function(err) {
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
    console.log("Delete request on path:", data.path);
    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;
    if (userId && token) {
        const tokenPromise = tokenService._checkToken(token);

        tokenPromise.then(token => {
            if (token && token.userId == userId && token.expireDate > Date.now()) {
                repositoryService._deleteEntity(userId, 'user', 'users', function(err) {
                    console.log(err);
                    if (!err) {
                        repositoryService._deleteEntity(token.id, 'token', 'tokens', function(err) {
                            if (!err) {
                                callback(false, { 'User and token': 'Deleted' });
                            } else {
                                callback(500, { 'Error': 'Token may be still alive' });
                            }
                        })
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