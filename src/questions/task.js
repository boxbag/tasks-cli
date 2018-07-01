'use strict';

var fuzzy = require('fuzzy');

module.exports = function (responsibilities) {
    return [
        {
            type: 'autocomplete',
            name: 'responsibility',
            message: 'Which responsibility is this task related to?',
            source: (answers, input) => {
                input = input || '';

                return new Promise(resolve => {
                    var fuzzyResult = fuzzy.filter(input, responsibilities.map(r => r.name));

                    resolve(fuzzyResult.map(el => {
                        return {
                            name: el.original,
                            value: responsibilities[el.index].id
                        };
                    }));
                });
            }
        },
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your task?',
            validate: require('./validators/required')
        },
        {
            type: 'confirm',
            name: 'is_necessary',
            message: 'Is this task really necessary?',
            default: false
        },
        {
            type: 'input',
            name: 'necessary_reason',
            message: 'Why do we absolutely need this?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'datetime',
            name: 'start_date',
            message: 'What date does this task start?',
            format: ['dddd', ' ', 'mm', '/', 'dd', '/', 'yyyy'],
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'estimated_duration',
            message: 'How many minutes do you expect this task to take?',
            default: '30',
            validate: require('./validators/positive_number'),
            filter: Number
        },
        {
            type: 'list',
            name: 'recurring_type',
            message: 'What type of recurrence is this task?',
            when: function (answers) {
                return answers.is_necessary === true;
            },
            choices: [
                'One time',
                'Weekly'
            ],
            default: 'One time'
        },
        {
            type: 'input',
            name: 'recurring_schedule',
            message: 'How often does this task recur?',
            when: function (answers) {
                return answers.is_necessary === true && answers.recurring_type !== 'One time';
            }
        },
        {
            type: 'input',
            name: 'stop_recurrence_after',
            message: 'After how many times should the recurrence stop? (type \'never\' if task recurs forever)',
            when: function (answers) {
                return answers.is_necessary === true && answers.recurring_type !== 'One time';
            }
        },
        {
            type: 'checkbox',
            name: 'recurring_days',
            message: 'Which days does this task recur on?',
            when: function (answers) {
                return answers.is_necessary === true && answers.recurring_type === 'Weekly';
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
            message: 'Can this task be automated right now?',
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'automation_task',
            message: 'How do we automate this task?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true && answers.can_automate === true;
            }
        },
        {
            type: 'input',
            name: 'cannot_automation_reason',
            message: 'Why can\'t we automate this right now?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true && answers.can_automate === false;
            }
        },
        {
            type: 'confirm',
            name: 'can_delegate',
            message: 'Can this task be delegated right now?',
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'delegate',
            message: 'Who do we delegate this to?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true && answers.can_delegate === true;
            }
        },
        {
            type: 'input',
            name: 'reason_cannot_delegate',
            message: 'Why can\'t you delegate this right now?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true && answers.can_delegate === false;
            }
        },
        {
            type: 'input',
            name: 'impact',
            message: 'What is the near term impact of this task? (1-10)',
            validate: require('./validators/number_scale'),
            filter: Number,
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'explain_impact',
            message: 'Why is this task impactful?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'urgency',
            message: 'What is the urgency of this? (1-10)',
            validate: require('./validators/number_scale'),
            filter: Number,
            when: function (answers) {
                return answers.is_necessary === true;
            }
        },
        {
            type: 'input',
            name: 'explain_urgency',
            message: 'Why is this urgent?',
            validate: require('./validators/required'),
            when: function (answers) {
                return answers.is_necessary === true;
            }
        }
    ];
};