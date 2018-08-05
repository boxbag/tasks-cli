'use strict';

const inquirer = require('inquirer');

const completeTaskQuestions = require('./templates/complete_task');

module.exports = async function () {
    return await inquirer.prompt(completeTaskQuestions);
};