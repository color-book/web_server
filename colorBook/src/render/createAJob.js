import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
import CreateAJobContainer from '../components/createAJob/container/createAJob'
import { dashboardReducer } from '../reducers/dashboardReducer.js'

const store = createStore(dashboardReducer, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <CreateAJobContainer />
  </Provider>,
  document.getElementById('root')
)