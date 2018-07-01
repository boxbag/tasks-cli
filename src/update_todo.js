'use strict';

const _ = require('underscore');
const arraySort = require('array-sort');
const inquirer = require('inquirer');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const path = require('path');

const fs = require('fs');
const responsibilities = require('./views/responsibilities');

const taskEvents = require('../data/task_events');
const scoredTasks = require('./views/scored_tasks')
const inProgressTasks = require('./views/pending_tasks')(moment().toDate());

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

console.log('Lets update your todo items!');

function reverseCompare (prop) {
    return function (a, b) {
        return b[prop] < a[prop];
    }
}

const updatedTasks = arraySort(inProgressTasks, reverseCompare('increment_count'), reverseCompare('score')).slice(0, 1).map(t => {
    return {
        name: `${t.score} [${t.responsibility_name}] ${t.name}`,
        value: t.id      
    };
});

const todoQuestions = require('./questions/update_todo')(updatedTasks);
const taskQuestions = require('./questions/task')(responsibilities);

if (inProgressTasks.length === 0) {
    console.log('You\'re all done for today! Go enjoy your life or add more tasks');
} else {
    inquirer.prompt(todoQuestions).then(answers => {
        if (answers.action === 'Complete') {
            taskEvents.push({
                id: uuidv4(),
                created: moment().toDate().toISOString(),
                name: 'COMPLETE_TASK',
                data: {
                    chosen_todo_item: answers.chosen_todo_item,
                    complete_action: answers.complete_action,
                    task_feeling: answers.task_feeling,
                    actual_duration: answers.actual_duration
                }
            });

            if (answers.should_follow_up) {
                return inquirer.prompt(taskQuestions).then(taskAnswers => {
                    taskEvents.push({
                        id: uuidv4(),
                        name: 'CREATE_TASK',
                        created: moment().toDate().toISOString(),
                        data: {
                            ...taskAnswers,
                            last_task_id: answers.chosen_todo_item
                        }
                    });
                });
            }
        } else if (answers.action === 'Punt') {
            taskEvents.push({
                id: uuidv4(),
                created: moment().toDate().toISOString(),
                name: 'PUNT_TASK',
                data: {
                    chosen_todo_item: answers.chosen_todo_item,
                    new_start_date: answers.new_start_date,
                    punt_reason: answers.punt_reason
                }
            });
        } else if (answers.action === 'Cancel') {
            taskEvents.push({
                id: uuidv4(),
                created: moment().toDate().toISOString(),
                name: 'CANCEL_TASK',
                data: {
                    chosen_todo_item: answers.chosen_todo_item,
                    cancellation_reason: answers.cancellation_reason
                }
            });
        } else if (answers.action === 'Increment') {
            taskEvents.push({
                id: uuidv4(),
                created: moment().toDate().toISOString(),
                name: 'INCREMENT_TASK',
                data: {
                    chosen_todo_item: answers.chosen_todo_item,
                    increment_action: answers.increment_action,
                    increment_feeling: answers.increment_feeling
                }
            });
        }
    }).then(() => {
        fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
    });
}