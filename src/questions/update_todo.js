'use strict';

const inquirer = require('inquirer');

const todoQuestions = require('./templates/update_todo');

module.exports = async function () {
    return await inquirer.prompt(todoQuestions);
};