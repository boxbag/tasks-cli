'use strict';

const eventPublisher = require('./utils/event_publisher');

const nextQuestionaire = require('./questions/next');
const responsibilityQuestionaire = require('./questions/responsibility');
const taskQuestionaire = require('./questions/task');
const valueQuestionaire = require('./questions/value');

const newTaskPrinter = require('./printers/new_task');

(async function () {
    newTaskPrinter();

    const answers = await nextQuestionaire();

    if (answers.type === 'Responsibility') {
        const responsibilityAnswers = await responsibilityQuestionaire();

        eventPublisher('responsibility_events', 'CREATE_RESPONSIBILITY', responsibilityAnswers);
    } else if (answers.type === 'Task') {
        const taskAnswers = await taskQuestionaire();

        eventPublisher('task_events', 'CREATE_TASK', taskAnswers);
    } else if (answers.type === 'Value') {
        const valueAnswers = await valueQuestionaire();
        
        eventPublisher('value_events', 'CREATE_VALUE', valueAnswers);
    }
})();