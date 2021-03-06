import axios from 'axios';
// import { push } from 'react-router-redux'
import { BASE_URL } from '../../config'

/*
 * action types
 */
export const SET_SIDEBAR_OPEN = 'SET_SIDEBAR_OPEN';
export const UPDATE_CREATE_JOB_INPUT = 'UPDATE_CREATE_JOB_INPUT';
export const JOB_VALIDATED = 'JOB_VALIDATED';
export const JOB_CREATED = 'JOB_CREATED';
export const FOCUS_START_DATE = 'FOCUS_START_DATE';
export const ADD_NEW_LINE_ITEM = 'ADD_NEW_LINE_ITEM';
export const UPDATE_LINE_ITEM = 'UPDATE_LINE_ITEM';
export const REMOVE_LINE_ITEM = 'REMOVE_LINE_ITEM';
export const LINE_ITEMS_ADDED = 'LINE_ITEMS_ADDED';
export const FULL_USER_LIST = 'FULL_USER_LIST';
export const UPDATE_SELECTED_USERS = 'UPDATE_SELECTED_USERS';
export const USERS_ADDED = 'USERS_ADDED';
export const QUICK_UPDATE_SPLIT_AMOUNTS = 'QUICK_UPDATE_SPLIT_AMOUNTS';
export const UPDATE_CONTRACTOR_SPLIT = 'UPDATE_CONTRACTOR_SPLIT';

/**
 * action creators
 */

/*BEGIN SYNCHRONOUS ACTIONS */
export function setSidebarOpen() {
  return { type: SET_SIDEBAR_OPEN }
}

export function updateCreateJobInput(element, value) {
  return { type: UPDATE_CREATE_JOB_INPUT, element, value }
}

export function jobValidated(validated, jobValidatedErrorMessage) {
  return { type: JOB_VALIDATED, validated, jobValidatedErrorMessage }
}

export function jobCreated(newJobUUID) {
  return { type: JOB_CREATED, newJobUUID }
}

export function focusStartDate() {
  return { type: FOCUS_START_DATE }
}

export function addNewLineItem() {
  return { type: ADD_NEW_LINE_ITEM }
}

export function updateLineItem(item, index, value) {
  return { type: UPDATE_LINE_ITEM, item, index, value }
}

export function removeLineItem(index) {
  return { type: REMOVE_LINE_ITEM, index }
}

export function lineItemsAdded() {
  return { type: LINE_ITEMS_ADDED }
}

export function fullUserList(users) {
  return { type: FULL_USER_LIST, users}
}

export function updateSelectedUsers(user) {
  return { type: UPDATE_SELECTED_USERS, user }
}

export function usersAdded() {
  return { type: USERS_ADDED }
}

export function quickUpdateSplitAmounts(splitAmount) {
  return { type: QUICK_UPDATE_SPLIT_AMOUNTS, splitAmount}
}


export function updateContractorSplit(element, value) {
  return { type: UPDATE_CONTRACTOR_SPLIT, element, value}
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

    let createAJobInfo = getState().createAJob
    let authToken = localStorage.getItem('CB_token')

    let postData = {
      title: createAJobInfo.title,
      projectTitle: createAJobInfo.projectTitle,
      jobID: createAJobInfo.jobID,
      clientName: createAJobInfo.clientName,
      clientPhoneNumber: createAJobInfo.clientPhoneNumber,
      clientStreet: createAJobInfo.clientStreet,
      clientCity: createAJobInfo.clientCity,
      clientState: createAJobInfo.clientState,
      estimatedTotalHours: createAJobInfo.estimatedTotalHours,
      estimatedStartDate: createAJobInfo.estimatedStartDate.format(),
      jobTotal: createAJobInfo.jobTotal,
      downPaymentPercentage: createAJobInfo.downPaymentPercentage,
      downPaymentAmount: createAJobInfo.downPaymentAmount
    }

    console.log('postData: ', postData)

    axios.post(`${BASE_URL}/api/create-new-job`, postData, {headers: {Authorization: authToken}})
      .then(res => {
        if (res.data.success) {
          console.log(res)
          dispatch(jobCreated(res.data.newJobUUID))
        }
      })
  }
}

export function asyncSaveLineItems() {
  return (dispatch, getState) => {
    let lineItems = getState().jobLineItems
    let authToken = localStorage.getItem('CB_token')
    let filteredLineItems = lineItems.filter((item, index) => {
      console.log(item)
      if (item.item && item.jobUUID) return item
    })
    let postData = {lineItems: filteredLineItems}

    axios.post(`${BASE_URL}/api/save-line-items`, postData, {headers: {Authorization: authToken}})
      .then(res => {
        if (res.data.success) {

          // Make call to get the users for the next page
          axios.get(`${BASE_URL}/api/gather-users`, {headers: {Authorization: authToken}})
            .then(res => {
              if (res.data.success) {
                let jobUUID = getState().newJobUUID
                let users = res.data.users.map(user => {return {uuid: user.uuid, name: `${user.firstname} ${user.lastname}`, jobUUID: jobUUID}})
                dispatch(fullUserList(users))
                dispatch(lineItemsAdded())
              }
            })
        }
      })

  }
}

export function asyncAddUsersToJob() {
  return (dispatch, getState) => {

    let jobUUID = getState().newJobUUID
    let formattedUsers = getState().selectedUsers.map((user) => {
      return {name: user.label, uuid: user.value, jobUUID: jobUUID}
    })

    let postData = {UsersToJob: formattedUsers}
    let authToken = localStorage.getItem('CB_token')

    axios.post(`${BASE_URL}/api/add-users-to-job`, postData, {headers: {Authorization: authToken}})
      .then(res => {
        if (res.data.success) {

          let splitsPutData = {
            jobUUID: jobUUID,
            subContractorSplit: getState().subContractorSplit,
            contractorSplit: getState().contractorSplit
          }

          axios.put(`${BASE_URL}/api/update-job-splits`, splitPutData, {headers: {Authorization: authToken}})
            .then(res => {
              if (res.data.success) {
                dispatch(usersAdded())
              }
            })
        }
        else {
          console.log('ERROR .... need to do something here')
        }
      })
  }
}
