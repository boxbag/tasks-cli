'use strict';

const inquirer = require('inquirer');

const responsibilities = require('../views/responsibilities');
const questions = require('./templates/next')(responsibilities);

module.exports = async function () {
    return await inquirer.prompt(questions);
};
