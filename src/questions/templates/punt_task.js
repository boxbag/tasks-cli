'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'input',
        name: 'punt_reason',
        message: 'What is the reason you\'re punting this task?',
        validate: require('../validators/required'),
    },
    {
        type: 'datetime',
        name: 'new_start_date',
        message: 'What is the new start date you want to punt to?',
        format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy'],
        initial: moment().add(1, 'day').toDate()
    }
];