'use strict';

const taskEvents = require('../../data/task_events.json');
const config = require('../../config');
const responsibilities = require('./responsibilities');
const tasks = taskEvents.reduce(require('../reducers/task')(config, responsibilities), []);

module.exports = tasks;