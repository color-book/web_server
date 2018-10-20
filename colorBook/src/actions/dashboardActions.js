import axios from 'axios';
// import { push } from 'react-router-redux'
import { BASE_URL } from '../../config'

/*
 * action types
 */
export const UPDATE_SELECTED_JOB = 'UPDATE_SELECTED_JOB';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const LOAD_JOBS = 'LOAD_JOBS';
export const REDIRECT = 'REDIRECT';

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

export function loadJobs(jobs) {
  return { type: LOAD_JOBS, jobs}
}

export function redirect(redirectPath) {
  return { type: REDIRECT, redirectPath}
}

/*END SYNCHRONOUS ACTIONS */

/* BEGIN THUNK ASYNC ACTIONS */

export function asyncLoadJobs() {
  return (dispatch, getState) => {
    let authToken = localStorage.getItem('CB_token')

    axios.get(`${BASE_URL}/api/gather-clocked-in-job`, {headers: {Authorization: authToken}})
      .then(res => {
        if (res.data.success) {
          if (res.data.jobTitles) {
            dispatch(loadJobs(res.data.jobTitles))
          } 
          else if (res.data.clockedInJobInfo) {
            console.log(res.data.clockedInJobInfo)
          }
        }
        else if (!res.data.success) {
          // dispatch to redirect path
          console.log(res.data)
          dispatch(redirect(res.data.redirect))
        }
      })
  }
}

export function asyncUpdateSelectedJob(job) {
  return (dispatch, getState) => {
    let authToken = localStorage.getItem('CB_token')

    axios.get(`${BASE_URL}/api/gather-time-punch-job-info/${job.value}`, {headers: {Authorization: authToken}})
      .then(res => {
        console.log(res)
        if (res.data.success) {

        }
      })
  }
}