'use strict';

const scoreSortedTasks = require('./score_sorted_tasks');

module.exports = scoreSortedTasks.filter(t => t.status === 'COMPLETED');