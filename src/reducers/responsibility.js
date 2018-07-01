'use strict';

const uuidv4 = require('uuid/v4');
const moment = require('moment');

module.exports = (responsibilities, event) => {
    if (event.name === 'CREATE_RESPONSIBILITY' && event.data.is_necessary === true) {
        responsibilities.push({
            id: event.id,
            created: moment().toDate().toISOString(),
            name: event.data.name,
            necessary_reason: event.data.necessary_reason,
            can_delegate: event.data.can_delegate,
            delegate: event.data.delegate,
            reason_cannot_delegate: event.data.reason_cannot_delegate,
            eventual_delegate: event.data.eventual_delegate,
            significance: event.data.significance,
            explain_significance: event.data.explain_significance
        });
    }

    return responsibilities;
};