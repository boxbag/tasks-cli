'use strict';

module.exports = [
    {
        type: 'input',
        name: 'necessary_reason',
        message: 'Why do we absolutely need this?',
        validate: require('../validators/required')
    },
    {
        type: 'confirm',
        name: 'can_delegate',
        message: 'Can this responsibility be delegated right now?'
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
        name: 'eventual_delegate',
        message: 'Who are you going to train to take this over eventually?',
        validate: require('../validators/required'),
        when: function (answers) {
            return answers.can_delegate === false;
        }
    },
    {
        type: 'input',
        name: 'significance',
        message: 'What is the significance of this responsibility? (1-10)',
        validate: require('../validators/number_scale'),
        filter: Number
    },
    {
        type: 'input',
        name: 'explain_significance',
        message: 'Why is this responsibility significant?',
        validate: require('../validators/required')
    }
];