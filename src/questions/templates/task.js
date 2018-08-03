'use strict';

const fuzzy = require('fuzzy');

module.exports = function (values) {
    return [
        {
            type: 'checkbox',
            name: 'aligned_values',
            message: 'Which values are this task aligned with?',
            when: function (answers) {
                return values.length > 0;
            },
            choices: values
        },
        {
            type: 'input',
            name: 'necessary_reason',
            message: 'Why do we absolutely need this?',
            validate: require('../validators/required')
        },
        {
            type: 'datetime',
            name: 'start_date',
            message: 'What date does this task start?',
            format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy']
        },
        {
            type: 'input',
            name: 'estimated_duration',
            message: 'How many minutes do you expect this task to take?',
            default: '30',
            validate: require('../validators/positive_number'),
            filter: Number
        },
        {
            type: 'list',
            name: 'recurring_type',
            message: 'What type of recurrence is this task?',
            choices: [
                'One time',
                'Weekly'
            ],
            default: 'One time'
        },
        {
            type: 'input',
            name: 'recurring_schedule',
            message: 'How often does this task recur? (1 for every week, 2 for every other, ...)',
            validate: require('../validators/positive_number'),
            when: function (answers) {
                return answers.recurring_type === 'Weekly';
            }
        },
        {
            type: 'confirm',
            name: 'does_stop_recurring',
            message: 'Does this task stop recurring after some number of iterations?',
            when: function (answers) {
                return answers.recurring_type === 'Weekly';
            }
        },
        {
            type: 'input',
            name: 'stop_recurrence_after',
            message: 'After how many times should the recurrence stop?',
            when: function (answers) {
                return answers.recurring_type !== 'One time' && answers.does_stop_recurring === true;
            }
        },
        {
            type: 'checkbox',
            name: 'recurring_days',
            message: 'Which days does this task recur on?',
            when: function (answers) {
                return answers.recurring_type === 'Weekly';
            },
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
            type: 'confirm',
            name: 'can_automate',
            message: 'Can this task be automated right now?'
        },
        {
            type: 'input',
            name: 'automation_task',
            message: 'How do we automate this task?',
            validate: require('../validators/required'),
            when: function (answers) {
                return answers.can_automate === true;
            }
        },
        {
            type: 'input',
            name: 'cannot_automation_reason',
            message: 'Why can\'t we automate this right now?',
            validate: require('../validators/required'),
            when: function (answers) {
                return answers.can_automate === false;
            }
        },
        {
            type: 'confirm',
            name: 'can_delegate',
            message: 'Can this task be delegated right now?'
        },
        {
            type: 'input',
            name: 'delegate',
            message: 'Who do we delegate this to?',
            validate: require('../validators/required'),
            when: function (answers) {
                return answers.can_delegate === true;
            }
        },
        {
            type: 'input',
            name: 'reason_cannot_delegate',
            message: 'Why can\'t you delegate this right now?',
            validate: require('../validators/required'),
            when: function (answers) {
                return answers.can_delegate === false;
            }
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