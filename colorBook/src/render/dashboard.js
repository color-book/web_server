import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
import DashboardContainer from '../components/JSC_Dashboard/container/dashboardMain.js'
import { dashboardReducer } from '../reducers/dashboardReducer'

const initialState = {
  jobNames: [{name: 'Nancy', uuid: 'fjdkas1'}, {name: 'Jones', uuid: 'fjdkas2'}, {name: 'Malinda', uuid: 'fjdkas3'}, {name: 'OakDale', uuid: 'fjdkas4'}, {name: 'Sue', uuid: 'fjdkas5'}],
  usersName: 'Josh',
  selectedJobToClockIn: null,
  sidebarOpen: false,
  page: g_page
}

const store = createStore(dashboardReducer, initialState, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <DashboardContainer />
  </Provider>,
  document.getElementById('root')
)