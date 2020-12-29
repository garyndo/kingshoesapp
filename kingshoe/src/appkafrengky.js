import React from 'react'
import Axios from 'axios'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

// import component
import Navigation from './components/navigation'

// import page
import Home from './pages/home'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import DetailProduct from './pages/detailProduct'

// import action login
import { login } from './actions'

class App extends React.Component {
    componentDidMount() {
        Axios.get(`http://localhost:2000/users/${localStorage.id}`)
            .then((res) => {
                console.log(res.data);
                this.props.login(res.data)
            })
            .catch((err) => console.log(err));
    }

    render() {
        return (
            <div>
                <Navigation />
                <Switch>
                    <Route path='/' component={Home} exact />
                    <Route path='/login' component={LoginPage} />
                    <Route path='/register' component={RegisterPage} />
                    <Route path='/detail' component={DetailProduct} />
                </Switch>
            </div>
        )
    }
}

export default connect(null, { login })(App)