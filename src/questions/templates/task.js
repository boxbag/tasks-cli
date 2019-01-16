'use strict';

module.exports = function () {
    return [
        {
            type: 'datetime',
            name: 'start_date',
            message: 'What date does this task start?',
            format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy']
        },
        {
            type: 'list',
            name: 'recurring_type',
            message: 'What type of recurrence is this task?',
            choices: [
                'One time',
                'Weekly',
                'EOM'
            ],
            default: 'One time'
        },
        {
            type: 'input',
            name: 'recurring_schedule',
            message: 'How often does this task recur? (1 for every interval, 2 for every other, ...)',
            validate: require('../validators/positive_number'),
            when: answers => answers.recurring_type !== 'One time'
        },
        {
            type: 'confirm',
            name: 'does_stop_recurring',
            message: 'Does this task stop recurring after some number of iterations?',
            when: answers => answers.recurring_type !== 'One time'
        },
        {
            type: 'input',
            name: 'stop_recurrence_after',
            message: 'After how many times should the recurrence stop?',
            when: answers => answers.recurring_type !== 'One time' && answers.does_stop_recurring === true
        },
        {
            type: 'checkbox',
            name: 'recurring_days',
            message: 'Which days does this task recur on?',
            when: answers => answers.recurring_type === 'Weekly',
            choices: [
                {
                    name: 'Sunday',
                    value: 0
                },
                {
                    name: 'Monday',
                    value: 1
                },
                {
                    name: 'Tuesday',
                    value: 2
                },
                {
                    name: 'Wednesday',
                    value: 3
                },
                {
                    name: 'Thursday',
                    value: 4
                },
                {
                    name: 'Friday',
                    value: 5
                },
                {
                    name: 'Saturday',
                    value: 6
                }
            ]
        },
        {
            type: 'input',
            name: 'automation_task',
            message: 'How will you automate this task?',
            validate: require('../validators/required'),
        },
        {
            type: 'input',
            name: 'delegate',
            message: 'Who will you delegate this to in the future?',
            validate: require('../validators/required')
        },
        {
            type: 'input',
            name: 'impact',
            message: 'What is the near term impact of this task? (1-10)',
            validate: require('../validators/number_scale'),
            filter: Number
        },
        {
            type: 'input',
            name: 'urgency',
            message: 'What is the urgency of this? (1-10)',
            validate: require('../validators/number_scale'),
            filter: Number
        }
    ];
};