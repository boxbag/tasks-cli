'use strict';

const _ = require('underscore');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

function calculateShouldRecur (t, tasks, now) {
    let shouldRecur;
    now = moment(now).startOf('day');

    if (t.recurring_type === 'One time') {
        return false;
    } else if (t.does_stop_recurring === false) {
        if (t.recurring_type === 'Weekly') {
            let starting = moment(t.start_date).add(1, 'day').startOf('day');

            starting.add(Number((t.recurring_schedule) - 1) * 7, 'day');

            while (!t.recurring_days.includes(starting.day()) || moment.duration(starting.diff(now)).days() < 1) {
                starting.add(1, 'day');
            }

            return starting.format('YYYY-MM-DD');
        } else if (t.recurring_type === 'EOM') {
            let starting = moment(t.start_date).add(1, 'day').endOf('month');

            starting.add(Number(t.recurring_schedule) - 1, 'month');

            return starting.format('YYYY-MM-DD');
        }
    } else {
        if (t.recurring_count < Number(t.stop_recurrence_after)) {
            if (t.recurring_type === 'Weekly') {
                let starting = moment(t.start_date).add(1, 'day').startOf('day');

                starting.add(Number((t.recurring_schedule) - 1) * 7, 'day');

                while (!t.recurring_days.includes(starting.day()) || moment.duration(starting.diff(now)).days() < 1) {
                    starting.add(1, 'day');
                }

                return starting.format('YYYY-MM-DD');
            } else if (t.recurring_type === 'EOM') {
                let starting = moment(t.start_date).add(1, 'day').endOf('month');

                starting.add(Number(t.recurring_schedule) - 1, 'month');

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
                name: event.data.name,
                necessary_reason: event.data.necessary_reason,
                success_metrics: event.data.success_metrics || '',
                start_date: moment(event.data.start_date).startOf('day').toDate().toISOString(),
                recurring_type: event.data.recurring_type,
                recurring_schedule: event.data.recurring_schedule,
                does_stop_recurring: event.data.does_stop_recurring,
                stop_recurrence_after: event.data.stop_recurrence_after,
                recurring_days: event.data.recurring_days,
                automation_task: event.data.automation_task,
                delegate: event.data.delegate,
                impact: event.data.impact,
                urgency: event.data.urgency,
                score: event.data.impact * config.task_score_multiplier_impact + event.data.urgency * config.task_score_multiplier_urgency,
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
                    t.complete_action = event.data.complete_action;
                    t.actual_duration = event.data.actual_duration;
                    t.recurring_count = t.recurring_count || 0;
                    t.increment_actions = t.increment_actions || [];

                    t.increment_actions.unshift({
                        date: event.created,
                        action: event.data.complete_action
                    });

                    let recurrence = calculateShouldRecur(t, tasks, event.created);

                    if (typeof recurrence === 'string') {
                        let clonedTask = _.clone(t);

                        clonedTask.start_date = recurrence;
                        clonedTask.recurring_count = clonedTask.recurring_count + 1;
                        clonedTask.status = 'PENDING';
                        clonedTask.id = event.id;
                        clonedTask.created = event.created;
                        clonedTask.updated = event.created;
                        clonedTask.original_task_id = t.original_task_id;
                        clonedTask.punt_count = 0;
                        clonedTask.should_cancel_on_next_punt = false;

                        delete clonedTask.complete_action;
                        delete clonedTask.actual_duration;
                        delete clonedTask.completed_date;
                        delete clonedTask.complete_date_start_of_day;

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
                        t.score += config.task_score_multiplier_punt_count;
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
        } else if (event.name === 'INCREMENT_TASK') {
            tasks
                .filter(t => t.id === event.data.chosen_todo_item)
                .forEach(t => {
                    t.increment_counts = t.increment_counts || {};
                    t.increment_actions = t.increment_actions || [];

                    let key = moment(event.created).startOf('day').toDate().toISOString();

                    t.increment_counts[key] = t.increment_counts[key] || 0;
                    t.increment_counts[key] += 1;

                    t.increment_actions.unshift({
                        date: event.created,
                        action: event.data.increment_action
                    });

                    t.updated = event.created;

                    if (event.data.next_check_date) {
                        t.start_date = moment(event.data.next_check_date).startOf('day').toDate().toISOString()
                    }
                });
        }

        return tasks;    
    };
};