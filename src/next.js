'use strict';

const inquirer = require('inquirer');

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const path = require('path');
const moment = require('moment');

const taskEvents = require('../data/task_events.json');

const responsibilityEvents = require('../data/responsibility_events.json');
const responsibilities = responsibilityEvents.reduce(require('./reducers/responsibility'), []);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

console.log('Let me help you organize your life!');

let choices;

if (responsibilities.length === 0) {
    choices = ['Responsibility'];
} else {
    choices = ['Responsibility', 'Task'];
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
const taskQuestions = require('./questions/task')(responsibilities);

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
    } else {
        inquirer.prompt(taskQuestions).then(taskAnswers => {
            taskEvents.push({
                id: uuidv4(),
                name: 'CREATE_TASK',
                created: moment().toDate().toISOString(),
                data: taskAnswers
            });

            fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
        });
    }
});