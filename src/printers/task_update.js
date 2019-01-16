'use strict';

const colors = require('colors');

module.exports = task => {
    console.log(`\n${colors.green(`${task.score} [${task.recurring_type}] (${task.recurring_count || 0}/${task.stop_recurrence_after || 0}) ${task.name}`)}\n`);
    console.log(`${colors.yellow(task.necessary_reason)}\n`);

    if (task.can_delegate) {
        console.log(`Delegate: ${colors.cyan(task.delegate)}\n`);
    } else {
        console.log(`Delegate: ${colors.cyan('Consider pairing up on this task')}\n`);
    }
};