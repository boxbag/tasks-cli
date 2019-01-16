'use strict';

const colors = require('colors');

module.exports = task => {
    console.log(`\n${colors.green(`${task.score} [${task.recurring_type}] (${task.recurring_count || 0}/${task.stop_recurrence_after || 0}) ${task.name}`)}\n`);
    console.log(`${colors.yellow(task.necessary_reason)}\n`);
};