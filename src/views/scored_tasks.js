'use strict';

const _ = require('underscore');

const tasks = require('./tasks');
const responsibilities = require('./responsibilities');

const config = require('../../config.json');

const scoredTasks = tasks.map(t => {
    let responsibility = responsibilities.filter(r => r.id === t.responsibility)[0];

    t.responsibility_name = responsibility.name;
    t.score = t.impact * config.task_score_multiplier_impact + responsibility.significance * config.task_score_multiplier_significance + t.urgency * config.task_score_multiplier_urgency + t.punt_count * config.task_score_multiplier_punt_count;

    return t;
});

module.exports = _.sortBy(scoredTasks, t => -t.score);