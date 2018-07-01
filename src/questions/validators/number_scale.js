'use strict';

module.exports = (value) => {
    var parsed = parseFloat(value);

    if (isNaN(parsed)) {
        return 'Please enter a number';
    }

    var floored = Math.floor(parsed);

    return (floored > 0 && floored < 11) || 'Please enter a number between 1-10';
};