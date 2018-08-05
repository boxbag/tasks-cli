'use strict';

const inquirer = require('inquirer');

module.exports = async function () {
    const question = require('./templates/task_review_ready');

    return await inquirer.prompt(question);
};