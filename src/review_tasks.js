'use strict';

const _ = require('underscore');
const moment = require('moment');

const eventPublisher = require('./utils/event_publisher');

const scoredTasks = require('./views/scored_tasks');

const taskReviewReadyQuestionaire = require('./questions/task_review_ready');
const taskReviewQuestionaire = require('./questions/task_review');
const taskQuestionaire = require('./questions/task');

const taskReviewPrinter = require('./printers/task_review');

const completedTasks = scoredTasks
    .filter(t => t.status === 'COMPLETED')
    .filter(t => moment(t.review_date).startOf('day').toDate() <= moment().startOf('day').toDate());

const sortedCompletedTasks = _.sortBy(
    _.sortBy(completedTasks, t => -moment(t.review_date).toDate().getTime()),
    t => -t.score
);

(async function () {
    for (let completedTask of sortedCompletedTasks) {
        taskReviewPrinter(completedTask);
        
        let answers = await taskReviewReadyQuestionaire();

        if (answers.is_ready === false) {
            eventPublisher('task_events', 'DELAY_REVIEW_TASK', {
                task_id: completedTask.id
            });
        } else {
            let taskReviewAnswers = await taskReviewQuestionaire(completedTask);

            eventPublisher('task_events', 'REVIEW_TASK', {
                ...taskReviewAnswers,
                task_id: completedTask.id
            });
        }

        if (answers.should_followup) {
            const taskAnswers = await taskQuestionaire();

            eventPublisher('task_events', 'CREATE_TASK', {
                ...taskAnswers,
                last_task_id: completedTask.id
            });
        }
    }
})();
