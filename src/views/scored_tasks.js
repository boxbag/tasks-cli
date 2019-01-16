'use strict';

const _ = require('underscore');

const tasks = require('./tasks');
const responsibilities = require('./responsibilities');

const config = require('../../config');

const scoredTasks = tasks.map(t => {
    return t;
});

module.exports = _.sortBy(scoredTasks, t => -t.score);