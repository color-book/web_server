import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
import CreateAJobContainer from '../components/createAJob/container/createAJob'
import { createAJobReducer } from '../reducers/createAJobReducer.js'

const store = createStore(createAJobReducer, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <CreateAJobContainer />
  </Provider>,
  document.getElementById('root')
)