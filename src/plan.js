'use strict';

const moment = require('moment');
const colors = require('colors');

for (let i = 0; i < 3; i++) {
    let date = moment().add(i, 'day');

    let relevantTasks;

    if (i === 0) {
        relevantTasks = require('./views/pending_tasks')(date.toDate());
    } else {
        relevantTasks = require('./views/pending_tasks_on_date')(date.toDate());
    }

    console.log(`\n${date.format('ddd YYYY-MM-DD')} - ${relevantTasks.length} Tasks\n`.yellow);

    let updatedTasks = relevantTasks.forEach(task => {
        console.log(`${task.score} [${task.responsibility_name}] ${task.name}`);
    });
}
