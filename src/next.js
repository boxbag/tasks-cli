'use strict';

const inquirer = require('inquirer');

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const moment = require('moment');

const taskEvents = require('../data/task_events.json');
const responsibilityEvents = require('../data/responsibility_events.json');
const valueEvents = require('../data/value_events.json');

const responsibilities = responsibilityEvents.reduce(require('./reducers/responsibility'), []);
const values = valueEvents.reduce(require('./reducers/value'), []);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

console.log('Let me help you organize your life!');

let choices;

if (responsibilities.length === 0) {
    choices = ['Responsibility'];
} else {
    choices = ['Task', 'Value', 'Responsibility'];
}

const questions = [
    {
        type: 'list',
        name: 'type',
        message: 'What are you adding',
        choices: choices
    }
];

const responsibilityQuestions = require('./questions/responsibility');
const taskQuestions = require('./questions/task')(responsibilities, values);
const valueQuestions = require('./questions/value');

inquirer.prompt(questions).then(answers => {
    if (answers.type === 'Responsibility') {
        inquirer.prompt(responsibilityQuestions).then(responsibilityAnswers => {
            responsibilityEvents.push({
                id: uuidv4(),
                name: 'CREATE_RESPONSIBILITY',
                created: moment().toDate().toISOString(),
                data: responsibilityAnswers
            });

            fs.writeFileSync(path.join(__dirname, '../data/responsibility_events.json'), JSON.stringify(responsibilityEvents, null, 4));
        });
    } else if (answers.type === 'Task') {
        inquirer.prompt(taskQuestions).then(taskAnswers => {
            taskEvents.push({
                id: uuidv4(),
                name: 'CREATE_TASK',
                created: moment().toDate().toISOString(),
                data: taskAnswers
            });

            fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
        });
    } else if (answers.type === 'Value') {
        inquirer.prompt(valueQuestions).then(valueAnswers => {
            valueEvents.push({
                id: uuidv4(),
                name: 'CREATE_VALUE',
                created: moment().toDate().toISOString(),
                data: valueAnswers
            });

            fs.writeFileSync(path.join(__dirname, '../data/value_events.json'), JSON.stringify(valueEvents, null, 4));
        });
    }
});