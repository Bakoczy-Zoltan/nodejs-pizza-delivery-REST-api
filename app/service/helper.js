/**
 * Helper module. Use a small utilities for any other module
 */


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

module.exports = helper;