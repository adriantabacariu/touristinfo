var env = process.env.NODE_ENV || 'local';
var configPath = './settings-' + env;

module.exports = require(configPath);
