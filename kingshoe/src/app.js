import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Navigation from './componetns/navigation'

import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'

class App extends React.Component {
    render() {
        return (
            <div>
                <Navigation/>
                <Switch>
                    <Route path='/' component={Home} exact/>
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register}/>
                </Switch>
            </div>
        )
    }
}

export default App 