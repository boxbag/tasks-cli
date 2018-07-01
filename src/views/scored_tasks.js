'use strict';

const _ = require('underscore');

const tasks = require('./tasks');
const responsibilities = require('./responsibilities');

const scoredTasks = tasks.map(t => {
    let responsibility = responsibilities.filter(r => r.id === t.responsibility)[0];

    t.responsibility_name = responsibility.name;
    t.score = t.impact * 100 + responsibility.significance * 10 + t.urgency - t.punt_count * 10;

    return t;
});

module.exports = _.sortBy(scoredTasks, t => -t.score);