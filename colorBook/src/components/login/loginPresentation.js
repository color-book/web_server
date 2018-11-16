import React from 'react'
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'
import PropTypes from 'prop-types'
// import './login.css'

const Login = ({loginSuccess, errorOccurred, errorMessage, login, updateEmail, updatePassword}) =>  {

  let loginForm

  if (loginSuccess) {
    window.location.href = '/dashboard'
  } else {
    loginForm = <div className="login-main">
    <Row>
      <Col className="colorBook-login-header">
        {/* <h2>Color Book</h2> */}
        <img id="logo" className="colorBook-logo" src="/static/img/color_book_logo.png" alt="Color Book" />
      </Col>
    </Row>
    <Row>
      <Col className="colorBook-login-form">
        <h3>Login</h3>
        <Form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" onChange={updateEmail} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" onChange={updatePassword} />
          </FormGroup>
        </Form>
        <Button onClick = {login}>Login</Button>
        {errorOccurred && <p className="error-message">{errorMessage}</p>}
        <a className="signup-link" href="/signup">Don't have an account? Signup Here</a>
      </Col>
    </Row>
  </div>
  }

  return (
    <main>{loginForm}</main>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  updateEmail: PropTypes.func.isRequired,
  updatePassword: PropTypes.func.isRequired,
  errorOccurred: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  loginSuccess: PropTypes.bool.isRequired
};

export default Login;