import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
import TimePunchContainer from '../components/timePunch/container/timePunch'
import { dashboardReducer } from '../reducers/dashboardReducer'
import { asyncLoadJobs } from '../actions/dashboardActions'

window.store = createStore(dashboardReducer, applyMiddleware(thunkMiddleware))

// Load jobs
store.dispatch(asyncLoadJobs())

ReactDOM.render(
  <Provider store={store}>
    <TimePunchContainer />
  </Provider>,
  document.getElementById('root')
)