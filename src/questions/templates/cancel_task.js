'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'input',
        name: 'cancellation_reason',
        message: 'What is the reason you\'re cancelling this task?',
        validate: require('../validators/required')
    }
];