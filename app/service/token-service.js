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
    console.log('loginData', loginData);

    fs.readFile(repositoryService.baseLib + 'db.json', 'utf8', function(err, dbData) {
        if (!err && dbData) {
            const dbDataObject = helper.parseJSONobject(dbData);
            let validUser = false;
            dbDataObject.users.forEach(user => {
                if (user.email == loginData.email && user.password == loginData.password) {
                    validUser = user.id;
                }
            });
            if (validUser) {
                const newToken = {
                    token: 'test123',
                    expireData: Date.now() + 1000 * 60 * 60,
                    userId: validUser
                }
                repositoryService._saveNewEntity(newToken, 'token', 'tokens', callback);
            } else {
                callback(403, { 'Error': 'Invalid email or password' });
            }
        } else {
            callback(500, { 'Error': 'Could not open the token file' });
        }
    })
}

tokenHandler.logout = function(data, callback) {

}

tokenHandler._searchUserByEmailAndPassword = function() {

}

module.exports = tokenHandler;