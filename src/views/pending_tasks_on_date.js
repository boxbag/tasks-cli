'use strict';

const moment = require('moment');
const scoredTasks = require('./scored_tasks');

module.exports = function (date) {
    return scoredTasks
        .filter(t => t.status === 'PENDING')
        .filter(t => {
            return moment(date).startOf('day').toDate().getTime() == moment(t.start_date).startOf('day').toDate().getTime() || (t.recurring_type === 'Weekly' && t.recurring_days.includes(moment(date).day()));
        });
};