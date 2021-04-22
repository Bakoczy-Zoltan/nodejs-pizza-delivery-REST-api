/**
 * This service is responsible for menu ordering and handling
 * 
 */

// Dependencies
const helper = require('../service/helper');
const tokenService = require('../service/token-service');
const repositoryService = require('../integration/repository-handler');
const validator = require('./validator');

const menuCard = {
    soup: [
        "Tomato", "Oninon", "Fruit"
    ],
    mainDish: [
        'Beefsteak', 'Crispy Chicken', 'Grilled Veggies'
    ],
    dessert: [
        'Chocolate cake', 'Fruit bomb', 'Ice cream'
    ]
};

const orderService = {};

orderService.methodHandler = function(data, callback) {
    const acceptableMethods = ['get', 'delete', 'post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        orderService[data.method](data, callback);
    } else {
        callback(405);
    }
}

orderService.get = function(data, callback) {
    callback(200, menuCard);
};

orderService.post = function(data, callback) {

    const userId = data.searchParamMap.get('id');
    const token = data.headers.token;

    if (userId && token) {
        let order = data.payLoad;
        order = validator.validateOrder(order);
        if (order) {
            const tokenPromise = tokenService._checkToken(token);
            tokenPromise.then(token => {
                    console.log('checked token', token)
                    if (token && token.userId == userId && token.expireDate > Date.now()) {
                        order.userId = userId;
                        repositoryService._saveNewEntity(order, 'order', 'orders', function(err, savedOrder) {
                            if (!err && savedOrder) {
                                callback(201, savedOrder);
                            } else {
                                callback(500, { 'Error': 'Could not save order' });
                            }
                        })
                    } else {
                        callback(400, { 'Error': 'invalid token or userId' });
                    }
                })
                .catch(err => {
                    callback(500, err);
                })
        } else {
            callback(400, { 'Error': 'Missing or invalid fields in order' });
        }
    } else {
        callback(403);
    }
};

orderService.delete = function(data, callback) {

    const orderId = data.searchParamMap.get('id');
    const userId = data.searchParamMap.get('userId');
    const token = data.headers.token;

    if (orderId && token) {
        const tokenPromise = tokenService._checkToken(token);
        tokenPromise.then(token => {
            if (token && token.userId == userId) {
                repositoryService._deleteEntity(orderId, 'order', 'orders', function(err) {
                    if (!err) {
                        callback(200, { 'Order': 'Deleted' });
                    } else {
                        callback(500, { 'Error': 'Could not delete order with id of: ', orderId });
                    }
                });
            } else {
                callback(400, { 'Error': 'Invalid token or userId' });
            }
        })
    } else {
        callback(403);
    }
}

module.exports = orderService;