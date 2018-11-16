import { connect } from 'react-redux'
import { loginUser, updateLoginInfo } from '../../actions/loginActions'
import Login from './loginPresentation'

const mapStateToProps = (state, ownProps) => {
  return {
    errorOccurred: state.errorOccurred,
    errorMessage: state.errorMessage,
    loginSuccess: state.loginSuccess
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    login: () => {dispatch(loginUser())},
    updateEmail: (e) => {dispatch(updateLoginInfo('email', e.target.value))},
    updatePassword: (e) => {dispatch(updateLoginInfo('password', e.target.value))}
  }
}

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default LoginContainer