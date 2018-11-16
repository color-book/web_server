
import {
  UPDATE_LOGIN_INFO,
  HANDLE_INVALID_LOGIN,
  REMOVE_ERROR_MESSAGE,
  LOGIN_SUCCESSFUL
} from '../actions/loginActions'

import update from 'immutability-helper';

export function loginReducer(state = {}, action) {
  switch (action.type) {
		case UPDATE_LOGIN_INFO:
      return updateLoginInfo(state, action.item, action.val)
    case HANDLE_INVALID_LOGIN:
      return handleInvalidLogin(state, action.errorMessage)
    case REMOVE_ERROR_MESSAGE:
      return removedErrorMessage(state)
    case LOGIN_SUCCESSFUL:
      return loginSuccessful(state)
    default:
      return state
  }
}

function updateLoginInfo(state, item, val) {
  return update(state, {[item]: {$set: val}})
}

function handleInvalidLogin(state, errorMessage) {
  let newState = update(state, {errorOccurred: {$set: true}})
  return update(newState, {errorMessage: {$set: errorMessage}})
}

function removedErrorMessage(state) {
  let newState = update(state, {errorOccurred: {$set: false}})
  return update(newState, {errorMessage: {$set: ''}})
}

function loginSuccessful(state) {
  return update(state, {loginSuccess: {$set: true}})
}
