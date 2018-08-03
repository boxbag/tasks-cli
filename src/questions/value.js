'use strict';

const inquirer = require('inquirer');
const valueQuestions = require('./templates/value');

module.exports = async function () {
    return await inquirer.prompt(valueQuestions);
};