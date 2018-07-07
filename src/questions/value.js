'use strict';

module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your value?',
        validate: require('./validators/required')
    }
];