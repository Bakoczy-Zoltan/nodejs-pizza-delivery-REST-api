/**
 * This service responsible the tokens' handling
 */

// Dependencies
const repositoryService = require('../integration/repository-handler');
const fs = require('fs');
const helper = require('./helper');

tokenHandler = {};

tokenHandler.methodHandler = function(data, callback) {
    tokenHandler[data.path](data, callback)
}

tokenHandler.login = function(data, callback) {
    const loginData = data.payLoad;
    let validUser;

    const promise = tokenHandler._searchUserByEmailAndPassword(loginData);
    promise.then(userID => {
            validUser = userID;
            if (validUser) {
                const newToken = {
                    token: helper.makeRandomToken(20),
                    expireDate: Date.now() + 1000 * 60 * 60 * 24,
                    userId: validUser
                }
                repositoryService._saveNewEntity(newToken, 'token', 'tokens', callback);
            } else {
                callback(403, { 'Error': 'Invalid email or password' });
            }
        })
        .catch(err => {
            console.log(err);
            callback(500, err);
        })
}

tokenHandler.logout = function(data, callback) {
    const loginData = data.payLoad;
    const promise = tokenHandler._searchUserByEmailAndPassword(loginData);

    promise
        .then(userId => {
            if (userId) {
                tokenHandler._deleteTokenByUserId(userId, callback);
            } else {
                callback(403, { 'Error': 'Invalid email or password' })
            }
        })
}

tokenHandler._searchUserByEmailAndPassword = function(loginData) {
    let validUser;
    const hashedPassword = helper.hashPassword(loginData.password);
    loginData.password = hashedPassword;

    return new Promise((res, rej) => {
        fs.readFile(repositoryService.baseLib + 'db.json', 'utf8', function(err, dbData) {
            if (!err && dbData) {
                const dbDataObject = helper.parseJSONobject(dbData);

                dbDataObject.users.forEach(user => {
                    if (user.email == loginData.email && user.password == loginData.password) {
                        validUser = user.id;
                    }
                });
                res(validUser);
            } else {
                rej(err);
            }
        })
    })
}

tokenHandler._deleteTokenByUserId = function(userId, callback) {
    fs.readFile(repositoryService.baseLib + 'token.json', function(err, tokenData) {
        if (!err) {
            const tokenListObject = helper.parseJSONobject(tokenData);
            const listWithoutDeletedToken = tokenListObject.tokens.filter(token => token.userId != userId);
            tokenListObject.tokens = listWithoutDeletedToken;
            const newJsonTokenData = helper.makeJSONobject(tokenListObject);
            repositoryService._refreshDataInJsonFile(repositoryService.baseLib, 'token', newJsonTokenData, function(err) {
                if (!err) {
                    callback(200);
                } else {
                    callback(500, { 'Error': 'Could not logout. Token still alive' });
                }
            });
        } else {
            callback(500, { 'Error': 'Coulf noz open token file' })
        }
    });
}

tokenHandler._checkToken = function(token) {
    let foundToken;
    return new Promise((res, rej) => {
        fs.readFile(repositoryService.baseLib + 'token.json', 'utf8', function(err, tokenData) {
            if (!err && tokenData) {
                const tokenDbObj = helper.parseJSONobject(tokenData);
                foundToken = tokenDbObj.tokens.find(tokenObj => tokenObj.token == token);
                res(foundToken);
            } else {
                rej(err);
            }
        })
    });
}

module.exports = tokenHandler;