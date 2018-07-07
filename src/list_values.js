'use strict';

const valueEvents = require('../data/value_events.json');
const values = valueEvents.reduce(require('./reducers/value'), []);

console.log(values.map(v => {
    return v.name;
}).join('\n'));