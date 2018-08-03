'use strict';

module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your responsibility?',
        validate: require('../validators/required')
    },
    {
        type: 'confirm',
        name: 'is_necessary',
        message: 'Is this responsibility really necessary?',
        default: false
    }
];