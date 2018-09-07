import axios from 'axios';
// import { push } from 'react-router-redux'
import { BASE_URL } from '../../config'

/*
 * action types
 */
export const UPDATE_SELECTED_JOB = 'UPDATE_SELECTED_JOB';
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';


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



/*END SYNCHRONOUS ACTIONS */

/* BEGIN THUNK ASYNC ACTIONS */
