import React from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'

//import action
import { getHistory } from '../action'

class HistoryPage extends React.Component{
    componentDidMount(){
        Axios.get(`http://localhost:2000/history?username=${this.props.username}`)
        .then((res)=> {
            console.log(res.data)
            this.props.getHistory(res.data)
        })
        .catch((err)=>console.log(err))
    }
    render(){
        console.log(this.props.history)
        return(
            <div>
                <h1>HISTORY PAGE</h1>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        history: state.history,
        username: state.user.username
    }
}

export default connect(mapStateToProps, {getHistory})(HistoryPage)