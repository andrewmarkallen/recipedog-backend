import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import axios from 'axios';

// import UsersList from './components/UsersList'
import About from './components/About'
import NavBar from './components/NavBar'
import Form from './components/Form'
import Logout from './components/Logout'
import UserStatus from './components/UserStatus'
import Recipes from './components/Recipes'
import RecipeCard from './components/RecipeCard'
import FrontPage from './components/FrontPage'

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

  loginUser(token) {
    window.localStorage.setItem('authToken', token)
    setTimeout(() => this.setState({ isAuthenticated: true }), 100)
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
              <div>
                <FrontPage/>
                {/* <UsersList users={this.state.users}/> */}
              </div>
            )} />
            <Route exact path='/about' component={About}/>
            <Route exact path='/myrecipes' render={(props)  =>  (
              <Recipes
                {...props}
                isAuthenticated={this.state.isAuthenticated}
                loginUser={this.loginUser}
              />
            )} />
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
            <Route exact path='/recipe/:id' render={(props)  =>  (
              <RecipeCard
                {...props}
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
