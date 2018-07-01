'use strict';

const moment = require('moment');

const scoredTasks = require('./scored_tasks');
const recentFinishedTasks = scoredTasks
    .filter(t => {
        return t.status === 'COMPLETED';
    })
    .filter(t => moment(t.completed_date).startOf('day').toDate() >= moment().subtract(14, 'days').startOf('day').toDate());

module.exports = recentFinishedTasks;