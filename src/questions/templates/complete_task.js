'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'input',
        name: 'complete_action',
        message: 'What did you do to complete this task?',
        validate: require('../validators/required')
    },
    {
        type: 'input',
        name: 'actual_duration',
        message: 'How many minutes did this task take to complete?',
        validate: require('../validators/positive_number'),
        filter: Number
    },
    {
        type: 'confirm',
        name: 'should_follow_up',
        message: 'Do you need to follow up and do something else after this?'
    }
];