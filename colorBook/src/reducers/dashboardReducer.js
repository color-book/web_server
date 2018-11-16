import moment from 'moment';
import {
  UPDATE_SELECTED_JOB,
  SET_SIDEBAR_OPEN,
  LOAD_JOBS,
  REDIRECT
} from '../actions/dashboardActions'

import update from 'immutability-helper';

const initialState = {
  jobNames: [],
  usersName: 'Josh',
  selectedJobToClockIn: null,
  sidebarOpen: false,
  page: g_page,
  redirect: false,
  redirectPath: ""
}

export function dashboardReducer(state = initialState, action) {
  
  switch(action.type) {
    case UPDATE_SELECTED_JOB:
      return updateSelectedJob(state, action.job)
    case SET_SIDEBAR_OPEN:
      return setSidebarOpen(state)
    case LOAD_JOBS:
      return loadJobs(state, action.jobs)
    case REDIRECT:
      return redirect(state, action.redirectPath)
    default:
      return state
  }

}

function updateSelectedJob(state, job) {
  return update(state, {selectedJobToClockIn: {$set: job}})
}

function setSidebarOpen(state) {
  let sidebarOpen = state.sidebarOpen
  return update(state, {sidebarOpen: {$set: !sidebarOpen}})
}

function loadJobs(state, jobs) {
  let formattedJobs = jobs.map(job => {
    return {label: `${job.title} - ${job.project_title}`, value: job.uuid}
  })

  return update(state, {jobNames: {$set: state.jobNames.concat(formattedJobs)}})
}

function redirect(state, redirectPath) {
  let newState = update(state, {redirectPath: {$set: redirectPath}})
  return update(newState, {redirect: {$set: true}})
}