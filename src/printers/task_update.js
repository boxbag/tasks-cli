'use strict';

const colors = require('colors');

module.exports = task => {
    console.log(`\n${colors.green(task.name)}\n`);
    console.log(`${colors.yellow(task.necessary_reason)}\n`);

    if (task.can_delegate) {
        console.log(`Delegate: ${colors.cyan(task.delegate)}`);
    } else {
        console.log(`Delegate: ${colors.cyan('Consider pairing up on this task')}`);
    }

    if (task.can_automate) {
        console.log(`Automation Task: ${colors.cyan(task.automation_task)}\n`);
    } else {
        console.log(`Automation Task: ${colors.cyan('Consider automating a portion of this task')}\n`);
    }
};