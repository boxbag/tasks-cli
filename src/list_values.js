'use strict';

const valueEvents = require('../data/value_events.json');
const values = valueEvents.reduce(require('./reducers/value'), []);
const colors = require('colors');

console.log('\n' + values.map(v => {
    return v.name.green;
}).join('\n') + '\n');