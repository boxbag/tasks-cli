'use strict';

module.exports = function (tasks) {
    return [
        {
            type: 'checkbox',
            name: 'chosen_tasks',
            message: 'Which tasks do you want to work on today?',
            choices: tasks,
            pageSize: 10
        }
    ];
};