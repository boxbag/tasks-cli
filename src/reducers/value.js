'use strict';

const moment = require('moment');

module.exports = (values, event) => {
    if (event.name === 'CREATE_VALUE') {
        values.push({
            id: event.id,
            created: moment().toDate().toISOString(),
            name: event.data.name
        });
    }

    return values;
};