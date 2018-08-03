'use strict';

const inquirer = require('inquirer');

const moment = require('moment');
const colors = require('colors');

const eventPublisher = require('./utils/event_publisher');

const responsibilityEvents = require('../data/responsibility_events.json');
const valueEvents = require('../data/value_events.json');

const responsibilities = responsibilityEvents.reduce(require('./reducers/responsibility'), []);
const values = valueEvents.reduce(require('./reducers/value'), []);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

console.log('\nLet\'s do something new!\n'.green);

const questions = require('./questions/next')(responsibilities);

const responsibilityQuestionaire = require('./questions/responsibility');

const initialTaskQuestions = require('./questions/initial_task')(responsibilities);
const taskQuestions = require('./questions/task')(values);
const valueQuestions = require('./questions/value');

(async function () {
    const answers = await inquirer.prompt(questions);

    if (answers.type === 'Responsibility') {
        const responsibilityAnswers = await responsibilityQuestionaire();

        if (responsibilityAnswers.is_necessary === true) {
            eventPublisher('responsibility_events', 'CREATE_RESPONSIBILITY', responsibilityAnswers);
        }
    } else if (answers.type === 'Task') {
        const initialTaskAnswers = await inquirer.prompt(initialTaskQuestions);

        if (initialTaskAnswers.is_necessary === true) {
            const taskAnswers = await inquirer.prompt(taskQuestions);

            eventPublisher('task_events', 'CREATE_TASK', {
                ...initialTaskAnswers,
                ...taskAnswers
            });
        }
    } else if (answers.type === 'Value') {
        const valueAnswers = await inquirer.prompt(valueQuestions);
        
        eventPublisher('value_events', 'CREATE_VALUE', valueAnswers);
    }
})();