/**
 * 
 * Repository layer. This service is responsible for connection to "database". In this case to db.json in .data folder
 * 
 */


// Dependencies
const fs = require('fs');
const helper = require('../service/helper');
const path = require('path');



const dataHandler = {};

dataHandler.baseLib = path.join(__dirname, '../.data/');

dataHandler._saveNewEntity = function(userObj, dbFileName, entityListName, callback) {
    if (userObj) {
        fs.readFile(dataHandler.baseLib + dbFileName + '.json', 'utf8', function(err, userData) {
            if (!err && userData) {
                const dbObj = helper.parseJSONobject(userData);

                const userListObject = dbObj[entityListName];
                let lastUserId = userListObject[(userListObject.length - 1)] !== undefined ? userListObject[(userListObject.length - 1)].id : 0;
                userObj.id = lastUserId + 1;
                userListObject.push(userObj);
                dbObj[entityListName] = userListObject;

                const jsonUserList = helper.makeJSONobject(dbObj);

                dataHandler._refreshDataInJsonFile(dataHandler.baseLib, dbFileName, jsonUserList, callback);
            } else {
                callback({ 'Error': 'Could not read the file of ' + dbFileName });
            }
        });
    } else {
        callback({ 'Error': 'Invalid or missing user' });
    }
}

dataHandler._deleteEntity = function(id, dbFileName, listName, callback) {
    if (id) {
        fs.readFile(dataHandler.baseLib + dbFileName + '.json', 'utf8', function(err, dbData) {
            if (!err && dbData) {
                const dbObj = helper.parseJSONobject(dbData);
                let indexOfDeletedUser = -1;
                dbObj[listName].forEach((user, index) => {
                    if (user.id == id) {
                        indexOfDeletedUser = index;
                    }
                });
                if (indexOfDeletedUser > -1) {
                    dbObj[listName].splice(indexOfDeletedUser, 1);
                    const jsonObjToSave = helper.makeJSONobject(dbObj);
                    dataHandler._refreshDataInJsonFile(dataHandler.baseLib, dbFileName, jsonObjToSave, callback);
                } else {
                    callback({ 'Error': 'User not found' });
                }
            } else {
                callback({ 'Error': 'Could not read db' });
            }
        })
    } else {
        callback({ 'Error': 'Invalid id' });
    }
}

dataHandler._refreshDataInJsonFile = function(baseLib, dbFileName, jsonObjToSave, callback) {
    const path = baseLib + dbFileName + '.json';

    fs.open(path, 'r+', function(err, fd) {
        if (!err && fd) {
            fs.writeFile(path, jsonObjToSave, function(err) {
                if (!err) {
                    fs.close(fd, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback({ 'Error': 'Could not close the file' });
                        }
                    })
                } else {
                    callback({ 'Error': 'Could not saved the new user' });
                }
            });
        } else {
            callback({ 'Error': 'Could not open db' })
        }
    });

}

module.exports = dataHandler;