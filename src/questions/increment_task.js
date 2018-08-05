'use strict';

const inquirer = require('inquirer');

const incrementTaskQuestions = require('./templates/increment_task');

module.exports = async function () {
    return await inquirer.prompt(incrementTaskQuestions);
};