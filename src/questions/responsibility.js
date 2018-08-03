'use strict';

const inquirer = require('inquirer');
const initialResponsibilityQuestions = require('./templates/initial_responsibility');
const responsibilityQuestions = require('./templates/responsibility');

module.exports = async function () {
    const initialResponsibilityAnswers = await inquirer.prompt(initialResponsibilityQuestions);

    if (initialResponsibilityAnswers.is_necessary === true) {
        const responsibilityAnswers = await inquirer.prompt(responsibilityQuestions);

        return {
            ...initialResponsibilityAnswers,
            ...responsibilityAnswers
        };
    }

    return initialResponsibilityAnswers;
};
