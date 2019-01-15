'use strict';

const eventPublisher = require('./utils/event_publisher');

const taskQuestionaire = require('./questions/task');

const newTaskPrinter = require('./printers/new_task');

(async function () {
    newTaskPrinter();

    const taskAnswers = await taskQuestionaire();

    eventPublisher('task_events', 'CREATE_TASK', taskAnswers);
})();