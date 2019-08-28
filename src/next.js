'use strict';

const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const taskQuestionaire = require('./questions/task');

const newTaskPrinter = require('./printers/new_task');

(async function () {
    newTaskPrinter();

    const taskAnswers = await taskQuestionaire();

    eventPublisher('task_events', 'CREATE_TASK', taskAnswers);

    console.log('\nThanks for the new task! Remember that this is just one step in your journey\n'.yellow);
})();