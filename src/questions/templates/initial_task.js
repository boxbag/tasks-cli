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
            type: 'confirm',
            name: 'is_necessary',
            message: 'Is this task really necessary?',
            default: false
        }
    ];
};