import React from 'react'

import CarouselComp from '../componetns/carousel'
import Products from '../componetns/product'


class Home extends React.Component {
    render() {
        return (
            <div>
                <CarouselComp/>
                <Products/>
            </div>
        )
    }
}

export default Home