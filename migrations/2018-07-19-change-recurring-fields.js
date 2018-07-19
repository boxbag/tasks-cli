'use strict';

const taskEvents = require('../data/task_events.json');

const updatedTaskEvents = taskEvents.map(t => {
    if (t.data.stop_recurrence_after === 'never') {
        t.data.does_stop_recurring = false;
    }
});

// fs.writeFileSync(path.join(__dirname, '../data/taskEvents.json'), JSON.stringify(updatedTaskEvents, null, 4));
