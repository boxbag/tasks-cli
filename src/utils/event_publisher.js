'use strict';

const moment = require('moment');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');

module.exports = (eventStoreName, eventName, data) => {
    const events = require(`../../data/${eventStoreName}.json`);

    events.push({
        id: uuidv4(),
        name: eventName,
        created: moment().toDate().toISOString(),
        data
    });

    fs.writeFileSync(path.join(__dirname, `../../data/${eventStoreName}.json`), JSON.stringify(events, null, 4));
};