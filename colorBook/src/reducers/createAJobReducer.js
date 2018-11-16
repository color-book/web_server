import {
  SET_SIDEBAR_OPEN,
  UPDATE_CREATE_JOB_INPUT,
  JOB_VALIDATED,
  JOB_CREATED,
  FOCUS_START_DATE,
  ADD_NEW_LINE_ITEM,
  UPDATE_LINE_ITEM,
  REMOVE_LINE_ITEM,
  LINE_ITEMS_ADDED,
  FULL_USER_LIST,
  UPDATE_SELECTED_USERS,
  USERS_ADDED,
  QUICK_UPDATE_SPLIT_AMOUNTS
} from '../actions/createAJobActions'

import update from 'immutability-helper';

const initialState = {
  usersName: 'Josh',
  sidebarOpen: false,
  page: g_page,
  newJobUUID: '',
  jobCreated: true,
  lineItemsCompleted: true,
  usersAdded: false,
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
  },
  jobLineItems: [{
    item: '',
    jobUUID: '',
    description: '',
    hours: '',
    price: ''
  }],
  fullUserList: [],
  selectedUsers: [],
  contractorSplit: undefined,
  subContractorSplit: undefined
}

export function createAJobReducer(state = initialState, action) {
  
  switch(action.type) {
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
    case ADD_NEW_LINE_ITEM:
      return addNewLineItem(state)
    case UPDATE_LINE_ITEM:
      return updateLineItem(state, action.item, action.index, action.value)
    case REMOVE_LINE_ITEM:
      return removeLineItem(state, action.index)
    case LINE_ITEMS_ADDED:
      return lineItemsAdded(state)
    case FULL_USER_LIST:
      return setFullUserList(state, action.users)
    case UPDATE_SELECTED_USERS:
      return updateSelectedUsers(state, action.user)
    case USERS_ADDED:
      return usersAdded(state)
    case QUICK_UPDATE_SPLIT_AMOUNTS:
      return quickUpdateSplitAmounts(state, action.splitAmount)
    case UPDATE_CONTRACTOR_SPLIT:
      return updateContractorSplit(state, action.element, action.value)
    default:
      return state
  }

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
  return update(newState, {jobCreated: {$set: true}})
}

function focusStartDate(state) {
  let currentFocusStartDate = state.createAJob.estimatedStartDateFocused
  return update(state, {createAJob: {estimatedStartDateFocused: {$set: !currentFocusStartDate}}})
}

function addNewLineItem(state) {
  let newLineItem = [{
    item: '',
    jobUUID: state.newJobUUID,
    description: '',
    hours: '',
    price: ''
  }]
  return update(state, {jobLineItems: {$set: state.jobLineItems.concat(newLineItem)}})
}

function updateLineItem(state, propertyName, index, value) {

  const newLineItems = state.jobLineItems.map((lineItem, lineIndex) => {
    if (index !== lineIndex) return lineItem
    else {
      lineItem[propertyName] = value
      return lineItem
    }
  });
  newLineItems[0].jobUUID = state.newJobUUID
  return update(state, {jobLineItems: {$set: newLineItems}})
}

function removeLineItem(state, index) {
  return update(state, {jobLineItems: {$set: state.jobLineItems.filter((item, itemIndex) => index !== itemIndex)}})
}

function lineItemsAdded(state) {
  return update(state, {lineItemsCompleted: {$set: true}})
}

function setFullUserList(state, users) {
  return update(state, {fullUserList: {$set: users}})
}

function updateSelectedUsers(state, users) {
  return update(state, {selectedUsers: {$set: users}})
}

function usersAdded(state) {
  return update(state, {usersAdded: {$set: true}})
}

function quickUpdateSplitAmounts(state, splitAmount) {
  let newState = update(state, {contractorSplit: {$set: splitAmount.contractor}})
  return update(newState, {subContractorSplit: {$set: splitAmount.sub}})
}

function updateContractorSplit(state, element, value) {
  return update(state, {[element]: {$set: value}})
}