'use strict';

const moment = require('moment');
const colors = require('colors');

const config = require('../config');

for (let i = config.task_plan_days - 1; i >= 0; i--) {
    let date = moment().add(i, 'day');

    let relevantTasks;

    if (i === 0) {
        relevantTasks = require('./views/pending_tasks')(date.toDate());
    } else {
        relevantTasks = require('./views/pending_tasks_on_date')(date.toDate());
    }

    let totalExpectedTime = relevantTasks.reduce((m, t) => { m += t.estimated_duration; return m; }, 0);

    console.log(`\n${date.format('ddd YYYY-MM-DD')} - ${relevantTasks.length} Tasks - ${totalExpectedTime / 60} hours\n`.yellow);

    let updatedTasks = relevantTasks.forEach(task => {
        console.log(`${task.score} [${task.responsibility_name}] ${task.name}`.green);
    });
}

console.log('');