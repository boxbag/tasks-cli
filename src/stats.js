'use strict';

const _ = require('underscore');
const stats = require('stats-lite');
const moment = require('moment');
const path = require('path');
const opn = require('opn');

const recentFinishedTasks = _.sortBy(
    require('./views/recent_finished_tasks').map(t => {
        t.completed_date = moment(t.completed_date).startOf('day').toDate();

        return t;
    }),
    t => t.completed_date
).map(t => {
    return {
        completed_date: t.completed_date,
        score: t.score,
        name: t.name,
        responsibility_name: t.responsibility_name,
        actual_duration: t.actual_duration
    };
});

const html = require('./templates/stats')(recentFinishedTasks);

const fs = require('fs');

fs.writeFileSync(path.join(__dirname, '../output/stats.html'), html);
opn(path.join(__dirname, '../output/stats.html'));

process.exit(-1);