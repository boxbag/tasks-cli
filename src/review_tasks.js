'use strict';

const _ = require('underscore');
const inquirer = require('inquirer');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const responsibilityEvents = require('../data/responsibility_events.json');
const taskEvents = require('../data/task_events.json');
const scoredTasks = require('./views/scored_tasks');

const responsibilities = responsibilityEvents.reduce(require('./reducers/responsibility'), []);
const taskQuestions = require('./questions/task')(responsibilities);

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const completedTasks = scoredTasks
    .filter(t => t.status === 'COMPLETED')
    .filter(t => moment(t.review_date).startOf('day').toDate() <= moment().startOf('day').toDate());

const sortedCompletedTasks = _.sortBy(completedTasks, t => -moment(t.review_date).toDate().getTime());

(async function () {
    for (let completedTask of sortedCompletedTasks) {
        let question = require('./questions/task_review')(completedTask);

        let answers = await inquirer.prompt(question);

        if (answers.is_ready) {
            taskEvents.push({
                id: uuidv4(),
                name: 'REVIEW_TASK',
                created: moment().toDate().toISOString(),
                data: {
                    task_id: completedTask.id,
                    was_necessary: answers.was_necessary,
                    explain_was_necessary: answers.explain_was_necessary,
                    review_impact: answers.review_impact,
                    explain_review_impact: answers.explain_review_impact,
                    review_urgency: answers.review_urgency,
                    explain_review_urgency: answers.explain_review_urgency,
                    can_automate_review: answers.can_automate_review,
                    explain_automate_review: answers.explain_automate_review,
                    can_delegate_review: answers.can_delegate_review,
                    explain_delegate_review: answers.explain_delegate_review
                }
            });
        } else {
            taskEvents.push({
                id: uuidv4(),
                name: 'DELAY_REVIEW_TASK',
                created: moment().toDate().toISOString(),
                data: {
                    task_id: completedTask.id
                }
            });
        }

        if (answers.should_followup) {
            let taskAnswers = await inquirer.prompt(taskQuestions);

            taskEvents.push({
                id: uuidv4(),
                name: 'CREATE_TASK',
                created: moment().toDate().toISOString(),
                data: {
                    ...taskAnswers,
                    last_task_id: completedTask.id
                }
            });
        }

        fs.writeFileSync(path.join(__dirname, '../data/task_events.json'), JSON.stringify(taskEvents, null, 4));
    }
})();
