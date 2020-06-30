'use strict';

const colors = require('colors');

module.exports = task => {
    console.log(`\n${colors.bold.green(`${task.score} [${task.created.substring(0, 10)}] [${task.recurring_type}] (${task.recurring_count || 0}/${task.stop_recurrence_after || 0}) ${task.name}`)}\n`);
    console.log(`${colors.bold.underline.white('Why?')} ${colors.bold.yellow(task.necessary_reason)}\n`);
    console.log(`${colors.bold.underline.white('Success measured by')} ${colors.bold.yellow(task.success_metrics || 'not specified')}\n`);

    if (task.increment_actions && task.increment_actions.length > 0) {
        let incrementActions = task.increment_actions.slice(0, 5).map(incrementAction => {
            return `${colors.bold.underline.white(new Date(incrementAction.date).toLocaleDateString('en-us', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' }))} - ${colors.bold.yellow(incrementAction.action)}`;
        }).join('\n');

        console.log(`${incrementActions}\n`);
    }
};