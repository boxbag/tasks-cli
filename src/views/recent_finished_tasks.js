'use strict';

const moment = require('moment');

const completedTasks = require('./completed_tasks');
const config = require('../../config');

const recentFinishedTasks = completedTasks
    .filter(t => moment(t.completed_date).startOf('day').toDate() >= moment().subtract(config.recent_finished_task_days, 'days').startOf('day').toDate());

module.exports = recentFinishedTasks;