'use strict';

const responsibilityEvents = require('../../data/responsibility_events.json');
const responsibilities = responsibilityEvents.reduce(require('../reducers/responsibility'), []);

module.exports = responsibilities;