'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'input',
        name: 'increment_action',
        message: 'What did you do to increment this task?',
        validate: require('../validators/required')
    },
    {
        type: 'datetime',
        name: 'next_check_date',
        message: 'When do you want to check on this task again?',
        format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy'],
        initial: moment().toDate()
    }
];