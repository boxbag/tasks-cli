'use strict';

const path = require('path');
const fs = require('fs');

if (!fs.existsSync(path.join(__dirname, '../data/task_events.json'))) {
    fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), '[]');
}

if (!fs.existsSync(path.join(__dirname, '../config/user.json'))) {
    fs.writeFileSync(path.join(__dirname, '../config/user.json'), '{}');
}