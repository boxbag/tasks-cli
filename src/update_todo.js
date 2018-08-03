'use strict';

const _ = require('underscore');
const inquirer = require('inquirer');
const moment = require('moment');
const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const scoredTasks = require('./views/scored_tasks')
const inProgressTasks = require('./views/pending_tasks')(moment().toDate());

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const updatedTasks = inProgressTasks.sort(
    (a, b) => { return (b.increment_count * -10000 + b.score) - (a.increment_count * -10000 + a.score); }
).slice(0, 1).map(t => {
    return {
        name: `${t.score} [${t.responsibility_name}] ${t.name}`,
        necessary_reason: t.necessary_reason,
        can_delegate: t.can_delegate,
        delegate: t.delegate,
        can_automate: t.can_automate,
        automation_task: t.automation_task,
        value: t.id
    };
});

const todoQuestions = require('./questions/update_todo');

const taskQuestionaire = require('./questions/task');

if (inProgressTasks.length === 0) {
    return console.log('\nYou\'re all done for today! Go enjoy your life or add more tasks\n'.green);
}

console.log(`\n${colors.green(updatedTasks[0].name)}\n`);
console.log(`${colors.yellow(updatedTasks[0].necessary_reason)}\n`);

if (updatedTasks[0].can_delegate) {
    console.log(`Delegate: ${colors.cyan(updatedTasks[0].delegate)}`);
} else {
    console.log(`Delegate: ${colors.cyan('Consider pairing up on this task')}`);
}

if (updatedTasks[0].can_automate) {
    console.log(`Automation Task: ${colors.cyan(updatedTasks[0].automation_task)}`);
} else {
    console.log(`Automation Task: ${colors.cyan('Consider automating a portion of this task')}`);
}

console.log('');

(async function () {
    const answers = await inquirer.prompt(todoQuestions);
    
    if (answers.action === 'Complete') {
        eventPublisher('task_events', 'COMPLETE_TASK', {
            ...answers,
            chosen_todo_item: updatedTasks[0].value
        });

        if (answers.should_follow_up) {
            const taskAnswers = await taskQuestionaire();

            if (taskAnswers.is_necessary === true) {
                eventPublisher('task_events', 'CREATE_TASK', {
                    ...taskAnswers,
                    last_task_id: updatedTasks[0].value
                });
            }
        }
    } else if (answers.action === 'Punt') {
        eventPublisher('task_events', 'PUNT_TASK', {
            ...answers,
            chosen_todo_item: updatedTasks[0].value
        });
    } else if (answers.action === 'Cancel') {
        eventPublisher('task_events', 'CANCEL_TASK', {
            ...answers,
            chosen_todo_item: updatedTasks[0].value
        });
    } else if (answers.action === 'Increment') {
        eventPublisher('task_events', 'INCREMENT_TASK', {
            ...answers,
            chosen_todo_item: updatedTasks[0].value
        });
    }
})();