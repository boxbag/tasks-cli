'use strict';

module.exports = (responsibilities) => {
    let choices;

    if (responsibilities.length === 0) {
        choices = ['Responsibility'];
    } else {
        choices = ['Task', 'Value', 'Responsibility'];
    }

    return [
        {
            type: 'list',
            name: 'type',
            message: 'What are you adding',
            choices: choices
        }
    ];
};