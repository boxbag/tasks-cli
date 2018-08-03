'use strict';

const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

console.log('\nLet\'s do something new!\n'.green);

const nextQuestionaire = require('./questions/next');
const responsibilityQuestionaire = require('./questions/responsibility');
const taskQuestionaire = require('./questions/task');
const valueQuestionaire = require('./questions/value');

(async function () {
    const answers = await nextQuestionaire();

    if (answers.type === 'Responsibility') {
        const responsibilityAnswers = await responsibilityQuestionaire();

        if (responsibilityAnswers.is_necessary === true) {
            eventPublisher('responsibility_events', 'CREATE_RESPONSIBILITY', responsibilityAnswers);
        }
    } else if (answers.type === 'Task') {
        const taskAnswers = await taskQuestionaire();

        if (taskAnswers.is_necessary === true) {
            eventPublisher('task_events', 'CREATE_TASK', taskAnswers);
        }
    } else if (answers.type === 'Value') {
        const valueAnswers = await valueQuestionaire();
        
        eventPublisher('value_events', 'CREATE_VALUE', valueAnswers);
    }
})();