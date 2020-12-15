import React from 'react'
import Axios from 'axios'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

class Products extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        Axios.get('http://localhost:2000/products')
            .then((res) => {
                this.setState({ data: res.data })
            })
            .catch((err) => console.log(err))
    }
    render() {
        // console.log(this.state.data)
        return (
            <div style={{ padding: '30px' }} >
                <h1>Our Products</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {this.state.data.map((item, index) => {
                        return (
                            <Card key={index} style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={item.images[1]} />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>
                                        {item.description}
                                    </Card.Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Button variant="warning" >Wish List</Button>
                                        <Button variant="primary" as={Link} to={`/detail?id=${item.id}`}>Buy Now</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
            </div>

        )
    }
}

export default Products