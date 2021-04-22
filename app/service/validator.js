/**
 * This validator service is responsible
 */

const validator = {};


validator.validateUser = function(userObj) {

    const email = typeof(userObj.email) === 'string' &&
        userObj.email.length > 5 &&
        userObj.email.includes('@') ? userObj.email : false;

    const password = typeof(userObj.password) === 'string' && userObj.password.length >= 8 ? userObj.password : false;
    const userName = typeof(userObj.name) === 'string' && userObj.name.length > 5 ? userObj.name : false;

    if (email && password && userName) {
        const newValidUser = {
            email: userObj.email,
            password: userObj.password,
            userName: userObj.name
        };
        return newValidUser;
    } else {
        return false;
    }
}

validator.validateOrder = function(orderObj) {
    let hasNoInvalidItems = true;

    let validOrder = typeof(orderObj.order) == 'object' &&
        orderObj.order instanceof Array &&
        orderObj.order.length > 0 ? true : false;

    if (validOrder) {
        hasNoInvalidItems = validator._checkItemsInOrderList(orderObj.order);
    }
    if (validOrder && hasNoInvalidItems) {
        return orderObj;
    } else {
        return false;
    }

}

validator._checkItemsInOrderList = function(list) {
    const dishes = ['Tomato soup', 'Onion soup', 'Beefsteak', 'CrispyChicken', 'Chocolate cake'];
    let notFoundInvalidItem = true;
    list.forEach(meal => {

        if (!(typeof(meal) == 'object') || !meal.dish || dishes.indexOf(meal.dish) == -1 || !(typeof(meal.count) == 'number') || meal.count < 1) {
            notFoundInvalidItem = false;
        }
    });
    return notFoundInvalidItem;
}

module.exports = validator;