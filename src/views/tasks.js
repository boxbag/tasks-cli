'use strict';

const taskEvents = require('../../data/task_events.json');
const config = require('../../config');
const tasks = taskEvents.reduce(require('../reducers/task')(config), []);

module.exports = tasks;