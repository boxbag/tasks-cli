'use strict';

const arraySort = require('array-sort');
const firstBy = require('thenby');

const data = [
    {
        score: 100,
        increment_count: 0,
        name: 'hello'
    },
    {
        score: 50,
        increment_count: 0,
        name: 'foo'
    },
    {
        score: 101,
        increment_count: 0,
        name: 'baz'
    },
    {
        score: 1000,
        increment_count: 1,
        name: 'bar'
    }
];

function compare (prop) {
    return function (a, b) {
        return a[prop] < b[prop];
    }
}

function reverseCompare (prop) {
    return function (a, b) {
        return b[prop] < a[prop];
    }
}

// console.log(arraySort(data, reverseCompare('increment_count'), reverseCompare('score')));

console.log(data.sort(
    (a, b) => { return a.increment_count * -10000 + a.score < b.increment_count * -10000 + b.score; })
);