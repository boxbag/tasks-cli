'use strict';

const moment = require('moment');

const taskPlanPrinter = require('./printers/task_plan');

const config = require('../config');

for (let i = config.task_plan_days - 1; i >= 0; i--) {
    let date = moment().add(i, 'day');

    let relevantTasks;

    if (i === 0) {
        relevantTasks = require('./views/pending_tasks')(date.toDate());
    } else {
        relevantTasks = require('./views/pending_tasks_on_date')(date.toDate());
    }

    taskPlanPrinter(date, relevantTasks);
}

console.log('');