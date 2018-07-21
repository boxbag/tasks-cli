'use strict';

const _ = require('underscore');
const inquirer = require('inquirer');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const path = require('path');
const colors = require('colors');

const fs = require('fs');
const responsibilities = require('./views/responsibilities');
const valueEvents = require('../data/value_events.json');
const values = valueEvents.reduce(require('./reducers/value'), []);

const taskEvents = require('../data/task_events');
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
const initialTaskQuestions = require('./questions/initial_task')(responsibilities);
const taskQuestions = require('./questions/task')(values);

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
        taskEvents.push({
            id: uuidv4(),
            created: moment().toDate().toISOString(),
            name: 'COMPLETE_TASK',
            data: {
                ...answers,
                chosen_todo_item: updatedTasks[0].value
            }
        });

        if (answers.should_follow_up) {
            const initialTaskAnswers = await inquirer.prompt(initialTaskQuestions);

            if (initialTaskAnswers.is_necessary === true) {
                const taskAnswers = await inquirer.prompt(taskQuestions);

                taskEvents.push({
                    id: uuidv4(),
                    name: 'CREATE_TASK',
                    created: moment().toDate().toISOString(),
                    data: {
                        ...initialTaskAnswers,
                        ...taskAnswers,
                        last_task_id: updatedTasks[0].value
                    }
                });
            }
        }
    } else if (answers.action === 'Punt') {
        taskEvents.push({
            id: uuidv4(),
            created: moment().toDate().toISOString(),
            name: 'PUNT_TASK',
            data: {
                ...answers,
                chosen_todo_item: updatedTasks[0].value
            }
        });
    } else if (answers.action === 'Cancel') {
        taskEvents.push({
            id: uuidv4(),
            created: moment().toDate().toISOString(),
            name: 'CANCEL_TASK',
            data: {
                ...answers,
                chosen_todo_item: updatedTasks[0].value
            }
        });
    } else if (answers.action === 'Increment') {
        taskEvents.push({
            id: uuidv4(),
            created: moment().toDate().toISOString(),
            name: 'INCREMENT_TASK',
            data: {
                ...answers,
                chosen_todo_item: updatedTasks[0].value
            }
        });
    }
    
    fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
})();