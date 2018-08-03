'use strict';

const valueEvents = require('../../data/value_events.json');
const values = valueEvents.reduce(require('../reducers/value'), []);

module.exports = values;