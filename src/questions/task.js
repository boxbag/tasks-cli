'use strict';

const inquirer = require('inquirer');

const responsibilities = require('../views/responsibilities');
const values = require('../views/values');

const initialTaskQuestions = require('./templates/initial_task')(responsibilities);
const taskQuestions = require('./templates/task')(values);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));

module.exports = async function () {
    const initialTaskAnswers = await inquirer.prompt(initialTaskQuestions);

    if (initialTaskAnswers.is_necessary === true) {
        const taskAnswers = await inquirer.prompt(taskQuestions);

        return {
            ...initialTaskAnswers,
            ...taskAnswers
        };
    }

    return initialTaskAnswers;
};