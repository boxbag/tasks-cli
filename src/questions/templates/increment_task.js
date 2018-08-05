'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'input',
        name: 'increment_action',
        message: 'What did you do to increment this task?',
        validate: require('../validators/required')
    }
];