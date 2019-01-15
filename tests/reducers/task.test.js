'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const config = require('../../config');

const responsibilityReducer = require('../../src/reducers/responsibility');

const tests = fs.readdirSync(path.join(__dirname, './fixtures'))
    .filter(f => f[0] !== '.');

describe('task reducer', () => {
    tests.forEach(test => {
        it(`correctly reduces the ${test} case`, () => {
            const fixture = require(`./fixtures/${test}/input.json`);
            const responsibilityFixture = require(`./fixtures/${test}/input_responsibility.json`);

            const responsibilityResults = responsibilityFixture.reduce(responsibilityReducer, []);

            const taskReducer = require('../../src/reducers/task')(config, responsibilityResults);
            const results = fixture.reduce(taskReducer, []);

            assert.deepStrictEqual(JSON.parse(JSON.stringify(results)), require(`./fixtures/${test}/output.json`));
        });
    });
});