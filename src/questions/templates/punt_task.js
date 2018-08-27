'use strict';

const moment = require('moment');

module.exports = task => {
    return [
        {
            type: 'confirm',
            name: 'confirm_punt_over_count',
            message: 'If you punt now, you will cancel the task. Are you sure you want to do this?',
            when: answers => task.should_cancel_on_next_punt === true
        },
        {
            type: 'input',
            name: 'punt_reason',
            message: 'What is the reason you\'re punting this task?',
            validate: require('../validators/required'),
            when: answers => task.should_cancel_on_next_punt !== true
        },
        {
            type: 'datetime',
            name: 'new_start_date',
            message: 'What is the new start date you want to punt to?',
            format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy'],
            initial: moment().add(1, 'day').toDate(),
            when: answers => task.should_cancel_on_next_punt !== true
        }
    ];
};