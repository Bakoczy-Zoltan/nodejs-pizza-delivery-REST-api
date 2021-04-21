/**
 * Helper module. Use a small utilities for any other module
 */


const helper = {};

helper.makeJSONobject = function(obj) {
    let jsonObj = null;
    try {
        jsonObj = JSON.stringify(obj);
    } catch (e) {
        console.log(e);
        jsonObj = JSON.stringify({});
    }
    return jsonObj;
}

module.exports = helper;