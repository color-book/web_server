import {
  UPDATE_SELECTED_JOB,
  SET_SIDEBAR_OPEN
} from '../actions/dashboardActions'

import update from 'immutability-helper';

export function dashboardReducer(state = {}, action) {
  
  switch(action.type) {
    case UPDATE_SELECTED_JOB:
      return updateSelectedJob(state, action.job)
    case SET_SIDEBAR_OPEN:
      return setSidebarOpen(state)
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