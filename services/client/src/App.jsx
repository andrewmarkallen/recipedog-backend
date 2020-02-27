import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import axios from 'axios';

import UsersList from './components/UsersList'
import About from './components/About'
import NavBar from './components/NavBar'
import Form from './components/Form'
import Logout from './components/Logout'
import UserStatus from './components/UserStatus'

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      title: 'RecipeDog',
      isAuthenticated: false,
    };
    this.logoutUser = this.logoutUser.bind(this)
    this.loginUser = this.loginUser.bind(this)
  };

  componentDidMount() {
    this.getUsers();
  }

  componentWillMount() {
    if (window.localStorage.getItem('authToken')) {
      this.setState({ isAuthenticated: true })
    }
  }

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
    .then((res) =>  { this.setState({ users: res.data.data.users }); })
    .catch((err) => { console.log(err) })
  }

  logoutUser() {
    window.localStorage.clear()
    this.setState({ isAuthenticated: false})
  }

  loginUser() {
    window.localStorage.setItem('authToken', token)
    this.setState({ isAuthenticated: true})
    this.getUsers()
  }

  render() {
    return (
    <div>
      <NavBar
        title ={this.state.title}
        isAuthenticated={this.state.isAuthenticated}
      />
      <div className="container">
        <div className="row">
          <div class4="col-md-6">
          <Switch>
            <Route exact path='/' render={()  => (
              <UsersList
                users={this.state.users}
              />
            )} />
            <Route exact path='/about' component={About}/>
            <Route exact path='/register' render={()  => (
              <Form
                formType={'register'}
                isAuthenticated={this.state.isAuthenticated}
                loginUser={this.loginUser}
              />
            )} />
            <Route exact path='/login' render={()  => (
              <Form
                formType={'login'}
                isAuthenticated={this.state.isAuthenticated}
                loginUser={this.loginUser}
              />
            )} />
            <Route exact path='/logout' render={()  => (
              <Logout
                logoutUser={this.logoutUser}
                isAuthenticated={this.isAuthenticated}
              />
            )} />
            <Route exact path='/status' render={()  =>  (
              <UserStatus
                isAuthenticated={this.state.isAuthenticated}
              />
            )}/>
          </Switch>
          </div>
        </div>
      </div>
    </div>
    )
  }
};

export default App;
