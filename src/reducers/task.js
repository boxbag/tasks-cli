'use strict';

const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

function calculateShouldRecur (t, tasks, now) {
    var shouldRecur;
    now = moment(now).startOf('day');

    if (t.recurring_type === 'One time') {
        return false;
    } else if (t.stop_recurrence_after === 'never') {
        if (t.recurring_type === 'Weekly') {
            var starting = moment(t.start_date).add(1, 'day').startOf('day');

            starting.add(Number((t.recurring_schedule) - 1) * 7, 'day');

            while (!t.recurring_days.includes(starting.day()) || moment.duration(starting.diff(now)).days() < 1) {
                starting.add(1, 'day');
            }

            return starting.format('YYYY-MM-DD');
        }
    } else {
        if (tasks.filter(task => task.original_task_id === t.id).length < Number(t.stop_recurrence_after)) {
            if (t.recurring_type === 'Weekly') {
                var starting = moment(t.start_date).add(1, 'day').startOf('day');

                starting.add(Number((t.recurring_schedule) - 1) * 7, 'day');

                while (!t.recurring_days.includes(starting.day()) || moment.duration(starting.diff(now)).days() < 1) {
                    starting.add(1, 'day');
                }

                return starting.format('YYYY-MM-DD');
            }
        }
    }

    return false;
}

module.exports = (tasks, event) => {
    if (event.name === 'CREATE_TASK' && event.data.is_necessary === true) {
        tasks.push({
            id: event.id,
            created: event.created,
            status: 'PENDING',
            punt_count: 0,
            punt_reasons: [],
            responsibility: event.data.responsibility,
            name: event.data.name,
            necessary_reason: event.data.necessary_reason,
            start_date: moment(event.data.start_date).startOf('day').toDate().toISOString(),
            recurring_type: event.data.recurring_type,
            recurring_schedule: event.data.recurring_schedule,
            stop_recurrence_after: event.data.stop_recurrence_after,
            recurring_days: event.data.recurring_days,
            can_automate: event.data.can_automate,
            automation_task: event.data.automation_task,
            cannot_automation_reason: event.data.cannot_automation_reason,
            can_delegate: event.data.can_delegate,
            delegate: event.data.delegate,
            reason_cannot_delegate: event.data.reason_cannot_delegate,
            impact: event.data.impact,
            explain_impact: event.data.explain_impact,
            urgency: event.data.urgency,
            explain_urgency: event.data.explain_urgency,
            original_task_id: event.id,
            increment_count: 0
        });
    } else if (event.name === 'COMPLETE_TASK') {
        tasks
            .filter(t => t.id === event.data.chosen_todo_item)
            .forEach(t => {
                t.status = 'COMPLETED';
                t.updated = event.created;
                t.completed_date = event.created;
                t.review_date = moment(event.created).startOf('day').add(14, 'days').toDate().toISOString();
                t.complete_action = event.data.complete_action;
                t.actual_duration = event.data.actual_duration;

                let recurrence = calculateShouldRecur(t, tasks, event.created);

                if (typeof recurrence === 'string') {
                    let clonedTask = _.clone(t);

                    clonedTask.start_date = recurrence;
                    clonedTask.status = 'PENDING';
                    clonedTask.id = event.id;
                    clonedTask.created = event.created;
                    clonedTask.original_task_id = t.original_task_id;
                    clonedTask.increment_count = 0;

                    tasks.push(clonedTask);
                }
            });
    } else if (event.name === 'PUNT_TASK') {
        tasks
            .filter(t => t.id === event.data.chosen_todo_item)
            .forEach(t => {
                t.status = 'PENDING';
                t.start_date = moment(event.data.new_start_date).startOf('day').toDate().toISOString();
                t.punt_count += 1;
                t.updated = event.created,
                t.punt_reasons.push(event.data.punt_reason);
                t.increment_count = 0;
            });
    } else if (event.name === 'CANCEL_TASK') {
        tasks
            .filter(t => t.id === event.data.chosen_todo_item)
            .forEach(t => {
                t.status = 'CANCELLED';
                t.cancellation_reason = event.data.cancellation_reason
            });
    } else if (event.name === 'REVIEW_TASK') {
        tasks
            .filter(t => t.id === event.data.task_id)
            .forEach(t => {
                t.status = 'REVIEWED';
                t.updated = event.created;
                t.review_completed_date = event.created;
                t.review_impact = event.data.review_impact;
                t.explain_review_impact = event.data.explain_review_impact,
                t.impact_delta = t.review_impact - t.impact;
                t.review_urgency = event.data.review_urgency,
                t.explain_review_urgency = event.data.explain_review_urgency,
                t.urgency_delta = t.review_urgency - t.urgency
            });
    } else if (event.name === 'DELAY_REVIEW_TASK') {
        tasks
            .filter(t => t.id === event.data.task_id)
            .forEach(t => {
                t.review_date = moment(event.created).startOf('day').add(14, 'days').toDate().toISOString();
            });
    } else if (event.name === 'INCREMENT_TASK') {
        tasks
            .filter(t => t.id === event.data.chosen_todo_item)
            .forEach(t => {
                if (moment(event.created).startOf('day').toDate().getTime() === moment().startOf('day').toDate().getTime()) {
                    t.increment_count += 1;
                }
            });
    }

    return tasks;    
};