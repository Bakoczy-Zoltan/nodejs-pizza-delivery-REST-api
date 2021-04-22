/**
 * Helper module. Use a small utilities for any other module
 */

const crypto = require('crypto');

const helper = {};

helper.makeJSONobject = function(obj) {
    let jsonObj = null;
    try {
        jsonObj = JSON.stringify(obj, null, 2);
    } catch (e) {
        console.log(e);
        jsonObj = JSON.stringify({});
    }
    return jsonObj;
}

helper.parseJSONobject = function(jsonObj) {
    let simpleObj = null;

    try {
        simpleObj = JSON.parse(jsonObj);
    } catch (e) {
        console.log(e);
        return false;
    }
    return simpleObj;
}

helper.makeRandomToken = function(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJIKLMNOPGRSTUVWXYZ0123456789';
    let token = '';
    const tokenLength = typeof(length) === 'number' && length > 0 ? length : false;

    if (tokenLength) {
        for (let i = 0; i < tokenLength; i++) {
            let randomChar = charset[Math.floor(Math.random() * charset.length)];
            token += randomChar;
        }
        return token;
    } else {
        return false;
    }
}

helper.hashPassword = function(password) {

    let validPassord = typeof(password) == 'string' && password.length >= 8 ? password : false;
    if (validPassord) {
        const hash = crypto.createHash('sha256').update(validPassord).digest('hex');
        validPassord = hash;
    }
    return validPassord;

}

module.exports = helper;