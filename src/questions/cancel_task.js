'use strict';

const inquirer = require('inquirer');

const cancelTaskQuestions = require('./templates/cancel_task');

module.exports = async function () {
    return await inquirer.prompt(cancelTaskQuestions);
};