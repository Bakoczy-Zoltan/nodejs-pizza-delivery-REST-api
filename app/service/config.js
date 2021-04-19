/**
 * Congfiguration file. Include the basic configuration for PORT, enviroment-name, foreign Api keys
 */

const enviroment = {};

enviroment.staging = {
    httpPort: '3000',
    httpsPort: '3080',
    envName: 'staging'
};

enviroment.production = {
    httpPort: '4000',
    httpsPort: '4433',
    envName: 'production'
};

const chosenEnviromentName = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : '';
const currentEnvviroment = typeof(enviroment[chosenEnviromentName]) === 'object' ? enviroment[chosenEnviromentName] : enviroment.staging;

module.exports = currentEnvviroment;