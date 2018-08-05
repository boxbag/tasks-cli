'use strict';

const taskEvents = require('../../data/task_events.json');
const tasks = taskEvents.reduce(require('../reducers/task'), []);

module.exports = tasks;