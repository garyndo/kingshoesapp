import React from 'react'
import Axios from 'axios'
import {
    Carousel
} from 'react-bootstrap'

class CarouselComp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        Axios.get('http://localhost:2000/slider')
            .then((res) => {
                // console.log(res.data)
                this.setState({ data: res.data })
            })
            .catch((err) => console.log(err))
    }
    render() {
        // console.log(this.state.data)
        return (
            <div>
                <Carousel>
                    {this.state.data.map((item, index) => {
                        return (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={item.image}
                                    alt="slide"
                                    style={{height:'630px'}}
                                />
                                <Carousel.Caption>
                                    <h3>{item.title}</h3>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            </div>
        )
    }
}

export default CarouselComp
