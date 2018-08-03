'use strict';

const moment = require('moment');
const colors = require('colors');

module.exports = task => {
    console.log(`\n${colors.yellow(moment(task.completed_date).format('ddd YYYY-MM-DD'))} ${colors.green(task.name)}\n`);
    console.log(`You did: ${colors.cyan(task.complete_action)}`);
    console.log(`You felt: ${colors.cyan(task.complete_feeling)}\n`);
};