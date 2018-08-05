'use strict';

const inquirer = require('inquirer');

const puntTaskQuestions = require('./templates/punt_task');

module.exports = async function () {
    return await inquirer.prompt(puntTaskQuestions);
};