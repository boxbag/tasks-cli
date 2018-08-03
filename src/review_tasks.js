'use strict';

const _ = require('underscore');
const moment = require('moment');

const eventPublisher = require('./utils/event_publisher');

const scoredTasks = require('./views/scored_tasks');

const taskReviewQuestionaire = require('./questions/task_review');
const taskQuestionaire = require('./questions/task');

const completedTasks = scoredTasks
    .filter(t => t.status === 'COMPLETED')
    .filter(t => moment(t.review_date).startOf('day').toDate() <= moment().startOf('day').toDate());

const sortedCompletedTasks = _.sortBy(
    _.sortBy(completedTasks, t => -moment(t.review_date).toDate().getTime()),
    t => -t.score
);

(async function () {
    for (let completedTask of sortedCompletedTasks) {
        console.log(`\n${colors.yellow(moment(task.completed_date).format('ddd YYYY-MM-DD'))} ${colors.green(task.name)}\n`);
        console.log(`You did: ${colors.cyan(task.complete_action)}`);
        console.log(`You felt: ${colors.cyan(task.complete_feeling)}\n`);
        
        let answers = await taskReviewQuestionaire(completedTask);

        if (answers.is_ready) {
            eventPublisher('task_events', 'REVIEW_TASK', {
                ...answers,
                task_id: completedTask.id
            });
        } else {
            eventPublisher('task_events', 'DELAY_REVIEW_TASK', {
                task_id: completedTask.id
            });
        }

        if (answers.should_followup) {
            const taskAnswers = await taskQuestionaire();

            if (taskAnswers.is_necessary === true) {
                eventPublisher('task_events', 'CREATE_TASK', {
                    ...taskAnswers,
                    last_task_id: completedTask.id
                });
            }
        }
    }
})();
