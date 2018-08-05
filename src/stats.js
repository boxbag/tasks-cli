'use strict';

const _ = require('underscore');
const stats = require('stats-lite');
const moment = require('moment');
const path = require('path');
const opn = require('opn');

const recentFinishedTasks = _.sortBy(
    require('./views/recent_finished_tasks'),
    t => t.completed_date
).map(t => {
    return {
        completed_date: t.complete_date_start_of_day,
        score: t.score,
        name: t.name,
        responsibility_name: t.responsibility_name,
        actual_duration: t.actual_duration / 60,
        can_delegate: t.can_delegate
    };
});

const delegatedTasksByDay = recentFinishedTasks.reduce((memo, task) => {
    memo[task.completed_date] = memo[task.completed_date] || {
        did_delegate: 0,
        did_not_delegate: 0
    };

    if (task.can_delegate) {
        memo[task.completed_date].did_delegate += 1;
    } else {
        memo[task.completed_date].did_not_delegate += 1;
    }

    return memo;
}, {});

const delegatedTasksByDayList = [];

for (let property in delegatedTasksByDay) {
    if (delegatedTasksByDay.hasOwnProperty(property)) {
        delegatedTasksByDayList.push({
            completed_date: property,
            type: 'did_delegate',
            count: delegatedTasksByDay[property].did_delegate
        });

        delegatedTasksByDayList.push({
            completed_date: property,
            type: 'did_not_delegate',
            count: delegatedTasksByDay[property].did_not_delegate
        });
    }
}

const html = require('./templates/stats')(recentFinishedTasks, delegatedTasksByDayList);

const fs = require('fs');

fs.writeFileSync(path.join(__dirname, '../output/stats.html'), html);
opn(path.join(__dirname, '../output/stats.html'));

process.exit(-1);