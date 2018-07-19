'use strict';

const inquirer = require('inquirer');

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const moment = require('moment');
const colors = require('colors');

const taskEvents = require('../data/task_events.json');
const responsibilityEvents = require('../data/responsibility_events.json');
const valueEvents = require('../data/value_events.json');

const responsibilities = responsibilityEvents.reduce(require('./reducers/responsibility'), []);
const values = valueEvents.reduce(require('./reducers/value'), []);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

console.log('\nLet\'s do something new!\n'.green);

const questions = require('./questions/next')(responsibilities);
const initialResponsibilityQuestions = require('./questions/initial_responsibility');
const responsibilityQuestions = require('./questions/responsibility');
const initialTaskQuestions = require('./questions/initial_task')(responsibilities);
const taskQuestions = require('./questions/task')(values);
const valueQuestions = require('./questions/value');

(async function () {
    const answers = await inquirer.prompt(questions);

    if (answers.type === 'Responsibility') {
        const initialResponsibilityAnswers = await inquirer.prompt(initialResponsibilityQuestions);

        if (initialResponsibilityAnswers.is_necessary === true) {
            const responsibilityAnswers = await inquirer.prompt(responsibilityQuestions);

            responsibilityEvents.push({
                id: uuidv4(),
                name: 'CREATE_RESPONSIBILITY',
                created: moment().toDate().toISOString(),
                data: {
                    ...initialResponsibilityAnswers,
                    ...responsibilityAnswers
                }
            });

            fs.writeFileSync(path.join(__dirname, '../data/responsibility_events.json'), JSON.stringify(responsibilityEvents, null, 4));
        }
    } else if (answers.type === 'Task') {
        const initialTaskAnswers = await inquirer.prompt(initialTaskQuestions);

        if (initialTaskAnswers.is_necessary === true) {
            const taskAnswers = await inquirer.prompt(taskQuestions);

            taskEvents.push({
                id: uuidv4(),
                name: 'CREATE_TASK',
                created: moment().toDate().toISOString(),
                data: {
                    ...initialTaskAnswers,
                    ...taskAnswers
                }
            });

            fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
        }
    } else if (answers.type === 'Value') {
        const valueAnswers = await inquirer.prompt(valueQuestions);
        
        valueEvents.push({
            id: uuidv4(),
            name: 'CREATE_VALUE',
            created: moment().toDate().toISOString(),
            data: valueAnswers
        });

        fs.writeFileSync(path.join(__dirname, '../data/value_events.json'), JSON.stringify(valueEvents, null, 4));
    }
})();