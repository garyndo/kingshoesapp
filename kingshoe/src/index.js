import React from 'react'
import ReactDom from 'react-dom'
import App from './app'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import allReducer from './reducers'

const globalState = createStore(allReducer)

globalState.subscribe(() => console.log("Global State:", globalState.getState()))

ReactDom.render(
    <Provider store={globalState}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,

    document.getElementById('root')
)