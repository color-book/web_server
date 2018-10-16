import moment from 'moment';
import {
  UPDATE_SELECTED_JOB,
  SET_SIDEBAR_OPEN,
} from '../actions/dashboardActions'

import update from 'immutability-helper';

const initialState = {
  jobNames: [{name: 'Nancy', uuid: 'fjdkas1'}, {name: 'Jones', uuid: 'fjdkas2'}, {name: 'Malinda', uuid: 'fjdkas3'}, {name: 'OakDale', uuid: 'fjdkas4'}, {name: 'Sue', uuid: 'fjdkas5'}],
  usersName: 'Josh',
  selectedJobToClockIn: null,
  sidebarOpen: false,
  page: g_page
}

export function dashboardReducer(state = initialState, action) {
  
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