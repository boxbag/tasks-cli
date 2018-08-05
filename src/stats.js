'use strict';

const _ = require('underscore');
const stats = require('stats-lite');
const moment = require('moment');
const path = require('path');
const opn = require('opn');

const recentFinishedTasks = _.sortBy(
    require('./views/recent_finished_tasks'),
    t => t.completed_date
).map(t => ({
        completed_date: t.complete_date_start_of_day,
        score: t.score,
        name: t.name,
        responsibility_name: t.responsibility_name,
        actual_duration: t.actual_duration / 60,
        can_delegate: t.can_delegate
    })
);

const html = require('./templates/stats')(recentFinishedTasks);

const fs = require('fs');

fs.writeFileSync(path.join(__dirname, '../output/stats.html'), html);
opn(path.join(__dirname, '../output/stats.html'));

process.exit(-1);