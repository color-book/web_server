import axios from 'axios';
// import { push } from 'react-router-redux'
import { BASE_URL } from '../../config'

/*
 * action types
 */
export const UPDATE_SELECTED_JOB = 'UPDATE_SELECTED_JOB';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const UPDATE_CREATE_JOB_INPUT = 'UPDATE_CREATE_JOB_INPUT'
export const JOB_VALIDATED = 'JOB_VALIDATED'
export const FOCUS_START_DATE = 'FOCUS_START_DATE'


/**
 * action creators
 */

/*BEGIN SYNCHRONOUS ACTIONS */
export function updateSelectedJob(job) {
  return { type: UPDATE_SELECTED_JOB, job }
}

export function setSidebarOpen() {
  return { type: SET_SIDEBAR_OPEN }
}

export function updateCreateJobInput(element, value) {
  return { type: UPDATE_CREATE_JOB_INPUT, element, value }
}

export function jobValidated(validated, jobValidatedErrorMessage) {
  return { type: JOB_VALIDATED, validated, jobValidatedErrorMessage }
}

export function focusStartDate() {
  return { type: FOCUS_START_DATE }
}

/*END SYNCHRONOUS ACTIONS */

/* BEGIN THUNK ASYNC ACTIONS */

export function asyncVerifyJobInfo() {
  return (dispatch, getState) => {

    let createAJob = getState().createAJob
    let postData = {
      title: createAJob.title,
      projectTitle: createAJob.projectTitle,
      jobID: createAJob.jobID
    }
    let authToken = localStorage.getItem('CB_token')
    
    axios.post(`${BASE_URL}/api/verify-job-title-and-id`, postData, {headers: {Authorization: authToken}})
      .then(res => {
          if (res.data.success) {
            console.log(res.data)
            if (res.data.jobValidated) dispatch(jobValidated(true, ''))
            else dispatch(jobValidated(false, res.data.errorMessage))
          }
      })
  }
}

export function asyncGenerateJobID() {
  return (dispatch) => {
    let authToken = localStorage.getItem('CB_token')

    axios.get(`${BASE_URL}/api/generate-job-id`, {headers: {Authorization: authToken}})
      .then(res => {
        if (res.data.success) {
          dispatch(updateCreateJobInput('jobID', res.data.generatedJobID))
        }
      })
  }
}

export function asyncCreateJob() {
  return (dispatch, getState) => {
    console.log(getState())
  }
}
