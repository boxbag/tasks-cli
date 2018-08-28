'use strict';

const assert = require('assert');

const taskReducer = require('../../src/reducers/task');

const tests = [
    'cancel_task',
    'recurring'
];

describe('task reducer', () => {
    tests.forEach(test => {
        it(`correctly reduces the ${test} case`, () => {
            const fixture = require(`./fixtures/${test}/input.json`);

            const results = fixture.reduce(taskReducer, []);

            assert.deepStrictEqual(JSON.parse(JSON.stringify(results)), require(`./fixtures/${test}/output.json`));
        });
    });
});