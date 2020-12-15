import React from 'react'
import Axios from 'axios'

class DetailProduct extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: {}
        }
    }
    componentDidMount(){
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
        .then((res)=>{
            // console.log(res.data[0])
            this.setState({data:res.data[0]})
        })
        .catch((err)=> console.log(err))
    }
    render(){
        console.log(this.state.data)
        return(
            <div>
                <h1>ini page detail product</h1>
            </div>
        )
    }
}

export default DetailProduct