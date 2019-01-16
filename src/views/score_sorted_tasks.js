'use strict';

const _ = require('underscore');

const tasks = require('./tasks');

const config = require('../../config');

module.exports = _.sortBy(tasks, t => -t.score);