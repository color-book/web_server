import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
// import LoginContainer from '../components/login/loginContainer'
import { dashboardReducer } from '../reducers/dashboardReducer'

const initialState = {
      
}

const store = createStore(dashboardReducer, initialState, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    Dashboard!!
  </Provider>,
  document.getElementById('root')
)