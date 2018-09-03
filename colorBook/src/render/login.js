import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux'
import LoginContainer from '../components/login/loginContainer'
import { loginReducer } from '../reducers/loginReducer'

const initialState = {
      email: '',
      password: '',
      errorOccurred: false,
      errorMessage: '',
      loginSuccess: false,
}

const store = createStore(loginReducer, initialState, applyMiddleware(thunkMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <LoginContainer />
  </Provider>,
  document.getElementById('root')
)