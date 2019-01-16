'use strict';

const moment = require('moment');
const colors = require('colors');

module.exports = (date, tasks) => {
    console.log(`\n${date.format('ddd YYYY-MM-DD')} - ${tasks.length} Tasks\n`.yellow);

    tasks.forEach(task => {
        console.log(`${task.score} ${task.name}`.green);
    });
};