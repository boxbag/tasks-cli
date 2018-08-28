'use strict';

const assert = require('assert');

const recurringFixture = require('./fixtures/recurring/input.json');
const taskReducer = require('../../src/reducers/task');

const results = recurringFixture.reduce(taskReducer, []);

assert.deepStrictEqual(JSON.parse(JSON.stringify(results)), require('./fixtures/recurring/output.json'));
