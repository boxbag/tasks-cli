'use strict';

const moment = require('moment');

module.exports = function (todoItems) {
    return [
        {
            type: 'list',
            name: 'chosen_todo_item',
            message: 'Which todo item do you want to modify?',
            choices: todoItems,
            pageSize: 10
        },
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do to this item?',
            choices: ['Complete', 'Punt', 'Cancel', 'Increment']
        },
        {
            type: 'input',
            name: 'increment_action',
            message: 'What did you do to increment this item?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Increment';
            }
        },
        {
            type: 'input',
            name: 'increment_feeling',
            message: 'How did you feel while incrementing this item?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Increment';
            }
        },
        {
            type: 'input',
            name: 'complete_action',
            message: 'What did you do to complete this item?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Complete';
            }
        },
        {
            type: 'input',
            name: 'task_feeling',
            message: 'How did you feel while doing this task?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Complete';
            }
        },
        {
            type: 'input',
            name: 'actual_duration',
            message: 'How many minutes did this task take to complete?',
            validate: require('./validators/positive_number'),
            filter: Number,
            when: function (answers) {
                return answers.action === 'Complete';
            }
        },
        {
            type: 'confirm',
            name: 'should_follow_up',
            message: 'Do you need to follow up and do something else after this?',
            when: function (answers) {
                return answers.action === 'Complete';
            }
        },
        {
            type: 'input',
            name: 'punt_reason',
            message: 'What is the reason you\'re punting this task?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Punt'
            }
        },
        {
            type: 'datetime',
            name: 'new_start_date',
            message: 'What is the new start date you want to punt to?',
            format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy'],
            when: function (answers) {
                return answers.action === 'Punt'
            },
            initial: moment().add(1, 'day').toDate()
        },
        {
            type: 'input',
            name: 'cancellation_reason',
            message: 'What is the reason you\'re cancelling this task?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.action === 'Cancel'
            }
        }
    ];
};