'use strict';

const moment = require('moment');

const completedTasks = require('./completed_tasks');

const recentFinishedTasks = completedTasks
    .filter(t => moment(t.completed_date).startOf('day').toDate() >= moment().subtract(14, 'days').startOf('day').toDate());

module.exports = recentFinishedTasks;