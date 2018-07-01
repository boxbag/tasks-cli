'use strict';

module.exports = (value) => {
    return value.length > 0 || 'This field is required';
};