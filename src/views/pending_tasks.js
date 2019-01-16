'use strict';

const moment = require('moment');
const scoreSortedTasks = require('./score_sorted_tasks');

module.exports = function (date) {
    return scoreSortedTasks
        .filter(t => t.status === 'PENDING')
        .filter(t => moment(date).startOf('day').toDate() >= moment(t.start_date).startOf('day').toDate());
};