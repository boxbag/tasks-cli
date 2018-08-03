'use strict';

const inquirer = require('inquirer');

const moment = require('moment');
const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const responsibilities = require('./views/responsibilities')

console.log('\nLet\'s do something new!\n'.green);

const questions = require('./questions/next')(responsibilities);

const responsibilityQuestionaire = require('./questions/responsibility');
const taskQuestionaire = require('./questions/task');

const valueQuestions = require('./questions/value');

(async function () {
    const answers = await inquirer.prompt(questions);

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
        const valueAnswers = await inquirer.prompt(valueQuestions);
        
        eventPublisher('value_events', 'CREATE_VALUE', valueAnswers);
    }
})();