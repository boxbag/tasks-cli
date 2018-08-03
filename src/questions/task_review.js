'use strict';

const inquirer = require('inquirer');

inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

module.exports = async function (completedTask) {
    const question = require('./templates/task_review')(completedTask);

    return await inquirer.prompt(question);
};