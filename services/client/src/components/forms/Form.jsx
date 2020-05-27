import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { registerFormRules, loginFormRules } from './form-rules'
import axios from 'axios'
import FormErrors from './FormErrors.jsx';
import ReCAPTCHA from 'react-google-recaptcha'
import { recaptcha_site_key } from '../Util'

class Form extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        username: '',
        email: '',
        password: '',
        response: ''
      },
      registerFormRules: registerFormRules,
      loginFormRules: loginFormRules,
      valid: false,
    }
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this)
    this.handleFormChange = this.handleFormChange.bind(this)
  }

  componentDidMount() {
    this.clearForm()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm()
      this.resetRules()
    }
  }
  clearForm() {
    this.setState({
      formData: {username: '', email: '', password: '', response: ''}
    })
  }

  allTrue() {
    let formRules = registerFormRules
    if (this.props.formType === 'login') {
      formRules = loginFormRules
    }
    for (const rule of formRules) {
      if (!rule.valid) return false
    }
    return true
  }

  resetRules() {
    if (this.props.formType === 'login') {
      const formRules = this.state.loginFormRules
      for (const rule of formRules) {
        rule.valid = false
      }
      this.setState({loginFormRules: formRules})
    }
    if (this.props.formType === 'register') {
      const formRules = this.state.registerFormRules
      for (const rule of formRules) {
        rule.valid = false
      }
      this.setState({registerFormRules: formRules})
    }
    this.setState({valid: false})
  }

  validateEmail(mail)
  {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
  }

  // We should do this more robustly...however captcha responses are validated
  // on the server side anyway so it doesn't really matter.
  captchaValid()
  {
    if (this.state.formData.response !== '')
    {
      return true
    }
    else
    {
      return false
    }
  }

  validateForm() {
    const self = this
    // get form data
    const formData = this.state.formData
    // reset all the rules
    self.resetRules()
    // validate registration form
    if (self.props.formType === 'register') {
      const formRules = self.state.registerFormRules;
      if (formData.username.length > 5) formRules[0].valid = true
      if (formData.email.length > 5) formRules[1].valid = true
      if (this.validateEmail(formData.email)) formRules[2].valid = true
      if (formData.password.length > 10) formRules[3].valid = true
      self.setState({registerFormRules: formRules})
      if ((self.allTrue()) && self.captchaValid()) self.setState({valid: true})
    }
    // validate login form
    if (self.props.formType === 'login') {
      const formRules = self.state.loginFormRules;
      if (formData.email.length > 0) formRules[0].valid = true
      if (formData.password.length > 0) formRules[1].valid = true
      self.setState({registerFormRules: formRules})
      if (self.allTrue()) self.setState({valid: true})
    }
  }

  handleFormChange(event) {
    const obj = this.state.formData
    obj[event.target.name] = event.target.value
    this.setState({formData: obj})
    this.validateForm()
  }

  handleUserFormSubmit(event) {
    event.preventDefault()
    const formType = this.props.formType
    let data
    if (formType === 'login') {
      data = {
        email: this.state.formData.email,
        password: this.state.formData.password
      }
    }
    if (formType === 'register') {
      data = {
        username: this.state.formData.username,
        email: this.state.formData.email,
        password: this.state.formData.password,
        response: this.state.formData.response
      }
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType}`
    axios.post(url, data)
      .then((res)  => {
        this.clearForm()
        this.props.loginUser(res.data.auth_token)
      })
      .catch((err)  => { console.log(err) })
  }

  render() {
    let formRules = this.state.loginFormRules
    if (this.props.formType === 'register') {
      formRules = this.state.registerFormRules
    }
    return (

      <div>
        { this.props.isAuthenticated &&
          <Redirect to={
            {
              pathname: '/myrecipes',
              state: { isAuthenticated: this.props.isAuthenticated }
            }
          }/>
        }

        <h1 style={{'textTransform':'capitalize'}}>{this.props.formType}</h1>
        <hr/><br/>
      <FormErrors
        formType={this.props.formType}
        formRules={formRules}
      />
      {/*
        for testing purposes:
        Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
        Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
      */}
      <form onSubmit={(event)  => this.handleUserFormSubmit(event)}>
        {this.props.formType === 'register' &&
          <ReCAPTCHA
            sitekey={recaptcha_site_key}
            onChange={(response) => {
              console.log(this.state)
              this.setState({
                formData: {...this.state.formData, response: response}
              })
              this.validateForm()
              console.log(this.state)

            }}
          />
        }
        {this.props.formType === 'register' &&
          <div className="form-group">
            <input
              name="username"
              className="form-control input-lg"
              type="text"
              placeholder="Enter a username"
              required
              value={this.state.formData.username}
              onChange={this.handleFormChange}
            />
          </div>
        }
        <div className="form-group">
          <input
            name="email"
            className="form-control input-lg"
            type="email"
            placeholder="Enter an email address"
            required
            value={this.state.formData.email}
            onChange={this.handleFormChange}
          />
        </div>
        <div className="form-group">
          <input
            name="password"
            className="form-control input-lg"
            type="password"
            placeholder="Enter a password"
            required
            value={this.state.formData.password}
            onChange={this.handleFormChange}
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary btn-lg btn-block"
          value="Submit"
          disabled={!this.state.valid}
        />
      </form>
      </div>
    )
  }
}

export default Form
