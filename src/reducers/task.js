'use strict';

const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

function calculateShouldRecur (t, tasks, now) {
    var shouldRecur;
    now = moment(now).startOf('day');

    if (t.recurring_type === 'One time') {
        return false;
    } else if (t.does_stop_recurring === false) {
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

module.exports = (config) => {
    return (tasks, event) => {
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
                does_stop_recurring: event.data.does_stop_recurring,
                stop_recurrence_after: event.data.stop_recurrence_after,
                recurring_days: event.data.recurring_days,
                can_automate: event.data.can_automate,
                automation_task: event.data.automation_task,
                cannot_automation_reason: event.data.cannot_automation_reason,
                can_delegate: event.data.can_delegate,
                delegate: event.data.delegate,
                reason_cannot_delegate: event.data.reason_cannot_delegate,
                impact: event.data.impact,
                estimated_duration: event.data.estimated_duration || config.task_estimated_duration_default_minutes,
                urgency: event.data.urgency,
                original_task_id: event.id,
                increment_counts: {}
            });
        } else if (event.name === 'COMPLETE_TASK') {
            tasks
                .filter(t => t.id === event.data.chosen_todo_item)
                .forEach(t => {
                    t.status = 'COMPLETED';
                    t.updated = event.created;
                    t.completed_date = event.created;
                    t.complete_date_start_of_day = moment(event.created).startOf('day').toDate();
                    t.review_date = moment(event.created).startOf('day').add(config.task_review_offset_days, 'days').toDate().toISOString();
                    t.complete_action = event.data.complete_action;
                    t.complete_feeling = event.data.task_feeling;
                    t.actual_duration = event.data.actual_duration;

                    let recurrence = calculateShouldRecur(t, tasks, event.created);

                    if (typeof recurrence === 'string') {
                        let clonedTask = _.clone(t);

                        clonedTask.start_date = recurrence;
                        clonedTask.status = 'PENDING';
                        clonedTask.id = event.id;
                        clonedTask.created = event.created;
                        clonedTask.original_task_id = t.original_task_id;
                        clonedTask.punt_count = 0;
                        clonedTask.should_cancel_on_next_punt = false;

                        tasks.push(clonedTask);
                    }
                });
        } else if (event.name === 'PUNT_TASK') {
            tasks
                .filter(t => t.id === event.data.chosen_todo_item)
                .forEach(t => {
                    if (t.should_cancel_on_next_punt && event.data.confirm_punt_over_count === true) {
                        t.status = 'CANCELLED';
                        t.cancellation_reason = 'OVER_PUNT_COUNT';
                    } else {
                        t.status = 'PENDING';
                        t.start_date = moment(event.data.new_start_date).startOf('day').toDate().toISOString();
                        t.punt_count += 1;
                        t.should_cancel_on_next_punt = t.punt_count >= config.cancel_punt_count;
                        t.updated = event.created,
                        t.punt_reasons.push(event.data.punt_reason);
                    }
                });
        } else if (event.name === 'CANCEL_TASK') {
            tasks
                .filter(t => t.id === event.data.chosen_todo_item)
                .forEach(t => {
                    t.status = 'CANCELLED';
                    t.updated = event.created;
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
                    t.review_date = moment(event.created).startOf('day').add(config.task_review_delay_offset_days, 'days').toDate().toISOString();
                });
        } else if (event.name === 'INCREMENT_TASK') {
            tasks
                .filter(t => t.id === event.data.chosen_todo_item)
                .forEach(t => {
                    t.increment_counts = t.increment_counts || {};

                    let key = moment(event.created).startOf('day').toDate().toISOString();

                    t.increment_counts[key] = t.increment_counts[key] || 0;
                    t.increment_counts[key] += 1;

                    t.updated = event.created;
                });
        }

        return tasks;    
    };
};