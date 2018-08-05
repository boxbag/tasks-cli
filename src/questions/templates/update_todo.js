'use strict';

const moment = require('moment');

module.exports = [
    {
        type: 'list',
        name: 'action',
        message: 'What do you want to do to this task?',
        choices: ['Complete', 'Punt', 'Cancel', 'Increment']
    }
];