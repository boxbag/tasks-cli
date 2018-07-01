'use strict';

const _ = require('underscore');
const stats = require('stats-lite');
const moment = require('moment');
const path = require('path');
const opn = require('opn');

const recentFinishedTasks = _.sortBy(require('./views/recent_finished_tasks').map(t => {
    t.completed_date = moment(t.completed_date).startOf('day').toDate();

    return t;
}), t => t.completed_date);

const html = require('./templates/stats')(recentFinishedTasks);

const fs = require('fs');

fs.writeFileSync(path.join(__dirname, '../output/stats.html'), html);
opn(path.join(__dirname, '../output/stats.html'));

process.exit(-1);