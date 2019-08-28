'use strict';

const _ = require('underscore');
const moment = require('moment');
const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const taskUpdatePrinter = require('./printers/task_update');

const inProgressTasks = require('./views/pending_tasks')(moment().toDate());

const now = moment().startOf('day').toDate().toISOString();

const updatedTask = inProgressTasks.sort(
    (a, b) => { return ((b.increment_counts[now] || 0) * -10000 + b.score) - ((a.increment_counts[now] || 0) * -10000 + a.score); }
)[0];

const updateTodoQuestionaire = require('./questions/update_todo');
const completeTaskQuestionaire = require('./questions/complete_task');
const puntTaskQuestionaire = require('./questions/punt_task');
const cancelTaskQuestionaire = require('./questions/cancel_task');
const incrementTaskQuestionaire = require('./questions/increment_task');
const taskQuestionaire = require('./questions/task');

if (inProgressTasks.length === 0) {
    return console.log('\nYou\'re all done for today! Go enjoy your life or add more tasks\n'.green);
}

taskUpdatePrinter(updatedTask);

(async function () {
    const answers = await updateTodoQuestionaire();
    
    if (answers.action === 'Complete') {
        const completeTaskAnswers = await completeTaskQuestionaire();

        eventPublisher('task_events', 'COMPLETE_TASK', {
            ...completeTaskAnswers,
            chosen_todo_item: updatedTask.id
        });

        if (completeTaskAnswers.should_follow_up) {
            const taskAnswers = await taskQuestionaire();

            eventPublisher('task_events', 'CREATE_TASK', {
                ...taskAnswers,
                last_task_id: updatedTask.id
            });
        }
    } else if (answers.action === 'Punt') {
        const puntTaskAnswers = await puntTaskQuestionaire(updatedTask);

        eventPublisher('task_events', 'PUNT_TASK', {
            ...puntTaskAnswers,
            chosen_todo_item: updatedTask.id
        });
    } else if (answers.action === 'Cancel') {
        const cancelTaskAnswers = await cancelTaskQuestionaire();

        eventPublisher('task_events', 'CANCEL_TASK', {
            ...cancelTaskAnswers,
            chosen_todo_item: updatedTask.id
        });
    } else if (answers.action === 'Increment') {
        const incrementTaskAnswers = await incrementTaskQuestionaire();

        eventPublisher('task_events', 'INCREMENT_TASK', {
            ...incrementTaskAnswers,
            chosen_todo_item: updatedTask.id
        });
    }

    console.log('\nThanks for the hard work! Remember that this is just one step in your journey\n'.yellow);
})();