'use strict';

const _ = require('underscore');
const moment = require('moment');
const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const taskUpdatePrinter = require('./printers/task_update');

const inProgressTasks = require('./views/pending_tasks')(moment().toDate());

const updatedTask = inProgressTasks.sort(
    (a, b) => { return (b.increment_count * -10000 + b.score) - (a.increment_count * -10000 + a.score); }
)[0];

const updateTodoQuestionaire = require('./questions/update_todo');
const taskQuestionaire = require('./questions/task');

if (inProgressTasks.length === 0) {
    return console.log('\nYou\'re all done for today! Go enjoy your life or add more tasks\n'.green);
}

taskUpdatePrinter(updatedTask);

(async function () {
    const answers = await updateTodoQuestionaire();
    
    if (answers.action === 'Complete') {
        eventPublisher('task_events', 'COMPLETE_TASK', {
            ...answers,
            chosen_todo_item: updatedTask.id
        });

        if (answers.should_follow_up) {
            const taskAnswers = await taskQuestionaire();

            eventPublisher('task_events', 'CREATE_TASK', {
                ...taskAnswers,
                last_task_id: updatedTask.id
            });
        }
    } else if (answers.action === 'Punt') {
        eventPublisher('task_events', 'PUNT_TASK', {
            ...answers,
            chosen_todo_item: updatedTask.id
        });
    } else if (answers.action === 'Cancel') {
        eventPublisher('task_events', 'CANCEL_TASK', {
            ...answers,
            chosen_todo_item: updatedTask.id
        });
    } else if (answers.action === 'Increment') {
        eventPublisher('task_events', 'INCREMENT_TASK', {
            ...answers,
            chosen_todo_item: updatedTask.id
        });
    }
})();