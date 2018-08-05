'use strict';

const scoredTasks = require('./scored_tasks');

module.exports = scoredTasks.filter(t => t.status === 'COMPLETED');