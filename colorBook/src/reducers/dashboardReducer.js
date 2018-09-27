import moment from 'moment';
import {
  UPDATE_SELECTED_JOB,
  SET_SIDEBAR_OPEN,
  UPDATE_CREATE_JOB_INPUT,
  JOB_VALIDATED,
  JOB_CREATED,
  FOCUS_START_DATE
} from '../actions/dashboardActions'

import update from 'immutability-helper';

const initialState = {
  jobNames: [{name: 'Nancy', uuid: 'fjdkas1'}, {name: 'Jones', uuid: 'fjdkas2'}, {name: 'Malinda', uuid: 'fjdkas3'}, {name: 'OakDale', uuid: 'fjdkas4'}, {name: 'Sue', uuid: 'fjdkas5'}],
  usersName: 'Josh',
  selectedJobToClockIn: null,
  sidebarOpen: false,
  page: g_page,
  newJobUUID: '',
  createAJob: {
    title: '',
    projectTitle: '',
    jobID: '',
    clientName: '',
    clientPhoneNumber: '',
    clientStreet: '',
    clientCity: '',
    clientState: '',
    estimatedTotalHours: '',
    estimatedStartDate: null,
    estimatedStartDateFocused: false,
    jobTotal: '',
    downPaymentPercentage: '',
    downPaymentAmount: '',
    jobValidated: false,
    jobValidationErrorMessage: '',
    jobCreated: true,
  },
  jobLineItems: [{
    title: '',
    notes: '',
    estimatedHours: '',
    estimatedPrice: ''
  }]
}

export function dashboardReducer(state = initialState, action) {
  
  switch(action.type) {
    case UPDATE_SELECTED_JOB:
      return updateSelectedJob(state, action.job)
    case SET_SIDEBAR_OPEN:
      return setSidebarOpen(state)
    case UPDATE_CREATE_JOB_INPUT:
      return updateCreateJobInput(state, action.element, action.value)
    case JOB_VALIDATED:
      return jobValidated(state, action.validated, action.jobValidationErrorMessage)
    case JOB_CREATED:
      return jobCreated(state, action.newJobUUID)
    case FOCUS_START_DATE:
      return focusStartDate(state)
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

function updateCreateJobInput(state, element, value) {
  return update(state, {createAJob: {[element]: {$set: value}}})
}

function jobValidated(state, validated, jobValidationErrorMessage) {
  let newState = update(state, {createAJob: {jobValidated: {$set: validated}}})
  return update(newState, {createAJob: {jobValidationErrorMessage: {$set: jobValidationErrorMessage}}})
}

function jobCreated(state, newJobUUID) {
  let newState = update(state, {newJobUUID: {$set: newJobUUID}})
  return update(newState, {createAJob: {jobCreated: {$set: true}}})
}

function focusStartDate(state) {
  let currentFocusStartDate = state.createAJob.estimatedStartDateFocused
  return update(state, {createAJob: {estimatedStartDateFocused: {$set: !currentFocusStartDate}}})
}