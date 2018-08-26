'use strict';

const inquirer = require('inquirer');

module.exports = async function (task) {
    const puntTaskQuestions = require('./templates/punt_task')(task);

    return await inquirer.prompt(puntTaskQuestions);
};