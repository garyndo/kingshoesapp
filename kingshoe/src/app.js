import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import Navigation from './componetns/navigation'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

import { login } from './action'

class App extends React.Component {
    componentDidMount() {
        Axios.get(`http://localhost:2000/users?username=${localStorage.username}`)
            .then((res) => this.props.login(res.data[0]))
            .catch((err) => console.log(err))
    }
    render() {
        return (
            <div>
                <Navigation />
                <Switch>
                    <Route path='/' component={Home} exact />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                </Switch>
            </div>
        )
    }
}

export default connect(null, { login })(App) 