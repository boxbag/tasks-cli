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
                    ...answers,
                    task_id: completedTask.id
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
