'use strict';

module.exports = function () {
    return [
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your task?',
            validate: require('../validators/required')
        },
        {
            type: 'input',
            name: 'necessary_reason',
            message: 'Why do you absolutely need this?',
            validate: require('../validators/required')
        },
        {
            type: 'input',
            name: 'success_metrics',
            message: 'How will you measure success?',
            validate: require('../validators/required')
        },
        {
            type: 'confirm',
            name: 'is_necessary',
            message: 'Is this task really necessary?',
            default: false
        }
    ];
};