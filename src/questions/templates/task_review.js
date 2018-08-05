'use strict';

const moment = require('moment');
const colors = require('colors');

module.exports = function (task) {
    return [
        {
            type: 'confirm',
            name: 'was_necessary',
            message: 'Was this task really necessary?',
            default: false
        },
        {
            type: 'input',
            name: 'explain_was_necessary',
            message: 'Why was this task really necessary?',
            validate: require('../validators/required'),
            when: answers => answers.was_necessary === true
        },
        {
            type: 'input',
            name: 'review_impact',
            message: `What impact did this task end up having? (1-10)`,
            validate: require('../validators/number_scale'),
            filter: Number
        },
        {
            type: 'input',
            name: 'explain_review_impact',
            message: 'Why did it have this impact?',
            validate: require('../validators/required')
        },
        {
            type: 'input',
            name: 'review_urgency',
            message: `How urgent was "${task.name}"? (1-10)`,
            validate: require('../validators/number_scale'),
            filter: Number
        },
        {
            type: 'input',
            name: 'explain_review_urgency',
            message: 'Why was it so urgent?',
            validate: require('../validators/required')
        },
        {
            type: 'confirm',
            name: 'can_automate_review',
            message: 'You said that this task could not be automated, do you think it can be automated now?',
            when: () => task.can_automate === false
        },
        {
            type: 'input',
            name: 'explain_automate_review',
            message: 'What would you do to automate it now?',
            validate: require('../validators/required'),
            when: answers => answers.can_automate_review === true
        },
        {
            type: 'input',
            name: 'explain_cannot_automate_review',
            message: 'Why can we not automate this still?',
            validate: require('../validators/required'),
            when: answers => answers.can_automate_review === false
        },
        {
            type: 'confirm',
            name: 'can_delegate_review',
            message: 'You said that this task could not be delegated, do you think it can be delegated now?',
            when: () => task.can_delegate === false
        },
        {
            type: 'input',
            name: 'explain_delegate_review',
            message: 'Who would you delegate this to now?',
            validate: require('../validators/required'),
            when: answers => answers.can_delegate_review === true
        },
        {
            type: 'input',
            name: 'explain_cannot_delegate_review',
            message: 'Why can we not delegate this still?',
            validate: require('../validators/required'),
            when: answers => answers.can_delegate_review === false
        },
        {
            type: 'confirm',
            name: 'should_followup',
            message: 'Do you want to create a follow up task for this?'
        }
    ];
};