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

dataHandler._saveNewEntity = function(entityObj, dbFileName, entityListName, callback) {
    if (entityObj) {
        fs.readFile(dataHandler.baseLib + dbFileName + '.json', 'utf8', function(err, userData) {
            if (!err && userData) {
                const dbObj = helper.parseJSONobject(userData);

                const userListObject = dbObj[entityListName];
                let lastUserId = userListObject[(userListObject.length - 1)] !== undefined ? userListObject[(userListObject.length - 1)].id : 0;
                entityObj.id = lastUserId + 1;
                userListObject.push(entityObj);
                dbObj[entityListName] = userListObject;

                const jsonUserList = helper.makeJSONobject(dbObj);

                dataHandler._refreshDataInJsonFile(dataHandler.baseLib, dbFileName, jsonUserList, entityObj, callback);
            } else {
                callback({ 'Error': 'Could not read the file of ' + dbFileName });
            }
        });
    } else {
        callback({ 'Error': 'Invalid or missing users data' });
    }
}

dataHandler._getEntityById = function(id, dbFileName, listName, callback) {
    let searchedEntity = null;
    fs.readFile(dataHandler.baseLib + dbFileName + '.json', 'utf8', function(err, dbData) {
        if (!err) {
            const dbObject = helper.parseJSONobject(dbData);
            dbObject[listName].forEach((entity, index) => {
                if (entity.id == id) {
                    searchedEntity = entity;
                }
            });
            if (searchedEntity) {
                callback(false, searchedEntity);
            } else {
                callback({ 'Error': listName + ' not found' });
            }
        } else {
            callback({ 'Error': 'Could not read db file' });
        }
    });
}

dataHandler._updateEntity = function(id, newValueObj, dbFileName, listName, callback) {
    fs.readFile(dataHandler.baseLib + dbFileName + '.json', 'utf8', function(err, dbData) {
        if (!err && dbData) {
            const dbObject = helper.parseJSONobject(dbData);
            dbObject[listName].forEach(entity => {
                if (entity.id == id) {
                    for (const key in newValueObj) {
                        entity[key] = newValueObj[key];
                    }
                }
            });
            const updatedJsonDBObject = helper.makeJSONobject(dbObject);
            dataHandler._refreshDataInJsonFile(dataHandler.baseLib, dbFileName, updatedJsonDBObject, function(err) {
                if (!err) {
                    callback(false);
                } else {
                    callback({ 'Error': 'Could not updated the ' + listName + ' list' });
                }
            })
        } else {
            callback({ 'Error': 'Could not open the db file' });
        }
    });

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

dataHandler._refreshDataInJsonFile = function(baseLib, dbFileName, jsonObjToSave, newEntity, callback) {
    const path = baseLib + dbFileName + '.json';

    fs.open(path, 'r+', function(err, fd) {
        if (!err && fd) {
            fs.writeFile(path, jsonObjToSave, function(err) {
                if (!err) {
                    fs.close(fd, function(err) {
                        if (!err) {
                            // const responseObject = helper.parseJSONobject(jsonObjToSave);
                            delete newEntity.password;
                            callback(false, newEntity);
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