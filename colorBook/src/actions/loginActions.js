import axios from 'axios';
// import { push } from 'react-router-redux'
import { BASE_URL } from '../../config'

/*
 * action types
 */
export const UPDATE_LOGIN_INFO = 'UPDATE_LOGIN_INFO';
export const LOGIN_USER = 'LOGIN_USER';
export const HANDLE_INVALID_LOGIN = 'HANDLE_INVALID_LOGIN';
export const REMOVE_ERROR_MESSAGE = 'REMOVE_ERROR_MESSAGE';
export const LOGIN_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const SAVE_TOKEN = 'SAVE_TOKEN';

/**
 * action creators
 */

/*BEGIN SYNCHRONOUS ACTIONS */
export function updateLoginInfo(item, val) {
  return { type: UPDATE_LOGIN_INFO, item, val }
}

export function handleInvalidLogin(errorMessage) {
  return { type: HANDLE_INVALID_LOGIN, errorMessage }
}

export function removeErrorMessage() {
  return { type: REMOVE_ERROR_MESSAGE }
}

export function loginSuccessful() {
  return { type: LOGIN_SUCCESSFUL }
}

/*END SYNCHRONOUS ACTIONS */

/* BEGIN THUNK ASYNC ACTIONS */
export function loginUser() {
  return (dispatch, getState) => {
    var postData = {
      email: getState().email,
      password: getState().password
    }

    axios.post(`${BASE_URL}/api/login`, postData)
      .then(res => {
        if (res.data.success) {
          // save token to local storage/move to dashboard
          localStorage.setItem('CB_token', res.data.token)
          dispatch(removeErrorMessage())
          dispatch(loginSuccessful())
        } else {
          // dispatch error message
          dispatch(handleInvalidLogin(res.data.errorMessage))
        }
      })
  }
}