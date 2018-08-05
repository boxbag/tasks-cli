'use strict';

const _ = require('underscore');
const defaultConfig = require('./default.json');

let userConfig;

try {
    userConfig = require('./user.json');
} catch (e) {
    userConfig = {};
}

module.exports = _.defaults(userConfig, defaultConfig);