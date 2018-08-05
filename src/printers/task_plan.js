'use strict';

const moment = require('moment');
const colors = require('colors');

module.exports = (date, tasks) => {
    let totalExpectedTime = tasks.reduce((m, t) => { m += t.estimated_duration; return m; }, 0);

    console.log(`\n${date.format('ddd YYYY-MM-DD')} - ${tasks.length} Tasks - ${totalExpectedTime / 60} hours\n`.yellow);

    tasks.forEach(task => {
        console.log(`${task.score} [${task.responsibility_name}] ${task.name}`.green);
    });
};