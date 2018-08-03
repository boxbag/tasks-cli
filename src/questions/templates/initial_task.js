'use strict';

const fuzzy = require('fuzzy');

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
            validate: require('../validators/required')
        },
        {
            type: 'confirm',
            name: 'is_necessary',
            message: 'Is this task really necessary?',
            default: false
        }
    ];
};