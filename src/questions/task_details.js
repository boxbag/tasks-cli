'use strict';

var fuzzy = require('fuzzy');

module.exports = function (tasks) {
    return [
        {
            type: 'autocomplete',
            name: 'task',
            message: 'Which task do you want details on?',
            source: (answers, input) => {
                input = input || '';

                return new Promise(resolve => {
                    var fuzzyResult = fuzzy.filter(input, tasks.map(t => t.name));

                    resolve(fuzzyResult.map(el => {
                        return {
                            name: el.original,
                            value: tasks[el.index].value
                        };
                    }));
                });
            }
        }
    ];
};