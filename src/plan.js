'use strict';

const moment = require('moment');

for (let i = 0; i < 3; i++) {
    let date = moment().add(i, 'day');

    console.log(date.format('ddd YYYY-MM-DD') + '\n');

    let relevantTasks = require('./views/pending_tasks')(date.toDate());

    let updatedTasks = relevantTasks.forEach(task => {
        console.log(`${task.score} [${task.responsibility_name}] ${task.name}`);
    });

    console.log('\n');
}
