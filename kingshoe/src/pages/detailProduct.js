import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import {
    Image,
    Button,
    Modal
} from 'react-bootstrap'

class DetailProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            image: '',
            selectedSize: null,
            size: null,
            stock: '',
            total: 0,
            toLogin: false,
            cartErr: false
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
            .then((res) => {
                console.log(res.data[0].images[1])
                this.setState({ data: res.data[0], image: res.data[0].images[1] })
            })
            .catch((err) => console.log(err))
    }

    handleAddToCart = () => {
        const { total, size, data } = this.state
        if (!this.props.id) return this.setState({ toLogin: true })         
        //proteksi klo size blm d pilih, dan total prodiuk yg d pilih masih 0
        if ( total === 0 || size === null) return this.setState({ cartErr: true })
        //dataproduk d defined atau bentuk lebih dulu
        let cartData = {
            name: data.name,
            image: data.images[1],
            category: data.category,
            brand: data.brand,
            colour: data.colour,
            price: data.price,
            size: size,  //size dari local state yg sudah d pilih oleh user
            total: total * data.price // total harga produk yg sudah d pilih sm user
        }
        console.log(cartData) // cek ud ke ambil blm datanya 

        //ambil data cart dariredux PROSES REDUX NI BOY
        let tempCart = this.props.cart
        console.log(tempCart) // cek dapet ga nih data dari redux yg d ambil dr db berupa array kosong boy
        tempCart.push(cartData) //push data inputan dr user k array kosongnya
        console.log(tempCart) //cek tempcart yg uddi isiinputan array terisi boy

        //memasukan data belanja kita menggunakan patch
        //bukan post, karna sudah ada cart d dlm db user berupa array tinggal kita isi dh
        Axios.patch(`http://localhost:2000/users/${this.props.id}`,{ //pilih user sesuaiid yg sedang aktif, PROSES PGRIMIN DATA
            cart: tempCart    // proses mengisi cart db yg kosong dengan objek yg user pilih yg sudah berbentuk tempcart                
        }) 
        .then((res)=>{
            console.log(res.data)
        })
        .catch((err)=>console.log(err))
        //proses patch dsnii mengganti atau mengisi data yg ada d cart user yg seblumny kosong mnjadi data yg baru setelahuser input blanjaan yg d inginkan boy
    }

    render() {
        const { data, image, selectedSize, total, stock, toLogin, cartErr } = this.state

        if (toLogin) return <Redirect to='/login' />
        // console.log(this.props.id)
        return (
            <div style={{ marginTop: '70px', padding: '0 20px' }}>
                <h1>Product Detail</h1>
                <div style={{ display: 'flex', height: '65vh' }}>
                    <div style={styles.img1}>
                        <Image src={image} rounded style={{ height: '90%', width: '90%' }} />
                    </div>
                    <div style={styles.detail}>
                        <div>
                            <h2>{data.name}</h2>
                            <h6>Category: {data.category}</h6>
                            <h6>Brand: {data.brand}</h6>
                            <h6>Colour: {data.colour}</h6>
                            <h6>Description: {data.description}</h6>
                            <h6>Price: IDR {data.price ? data.price.toLocaleString() : 0}</h6>
                            <div style={{ display: 'flex' }}>
                                <div style={{ marginRight: '50px' }}>
                                    <h5>Size: </h5>
                                    <div>
                                        {(data.stock || []).map((item, index) => {
                                            return (
                                                <Button
                                                    key={index}
                                                    onClick={() => this.setState({ size: item.code, selectedSize: index, stock: item.total })}
                                                    style={{
                                                        backgroundColor: selectedSize === index ? '#130f40' : '#ffffff',
                                                        color: selectedSize === index ? 'white' : 'black',
                                                    }}
                                                >
                                                    {item.code}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                    <h5>*stock = {stock} </h5>
                                </div>
                                <div style={{ width: '15%' }}>
                                    <h5>Quantity: </h5>
                                    <div style={{ display: 'flex', backgroundColor: 'white', borderRadius: '10px', justifyContent: 'space-between' }}>
                                        <Button
                                            disabled={total <= 0 ? true : false}
                                            variant="danger"
                                            onClick={() => this.setState({ total: total - 1 })}>
                                            -
                                        </Button>
                                        <h1>{total}</h1>
                                        <Button
                                            disabled={total >= stock ? true : false}
                                            variant="primary"
                                            onClick={() => this.setState({ total: total + 1 })}>
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={this.handleAddToCart}>Add to Cart</Button>
                    </div>
                </div>
                <Modal show={cartErr} onHide={() => this.setState({ cartErr: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>please input size and quantity product!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartErr: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    img1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '40%',
        borderRadius: '15px',
        backgroundColor: 'rgba(43, 104, 213, .7)'
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexBasis: '60%',
        backgroundColor: 'salmon',
        padding: '15px',
        borderRadius: '15px'
    },
    total: {
        display: 'flex',
        alignItems: 'center'
    },
    adjust: {
        display: 'flex',
        // alignItems: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps)(DetailProduct)


/* <div style={styles.adjust}>
                                <div style={{ marginRight: '50px' }}>
                                    <h5>Size : </h5>
                                    <div>
                                        {
                                            (data.stock ? data.stock : []).map((item, index) => {
                                                return <Button
                                                    key={index}
                                                    variant='outlined'
                                                    onClick={() => this.setState({ stock: item.total, selectedSize: index, size: item.code })}
                                                    style={{
                                                        backgroundColor: selectedSize === index ? '#130f40' : '#ffffff',
                                                        color: selectedSize === index ? 'white' : 'black',
                                                        border: '1px #130f40 solid'
                                                    }}
                                                >{item.code}</Button>
                                            })
                                        }
                                    </div>
                                    <h5>{stock ? `* stock = ${stock}` : ''}</h5>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <h5>Total: </h5>
                                    <div style={{ display: 'flex', borderRadius: '5px', backgroundColor: '#ffffff', justifyContent: 'space-between' }}>
                                        <Button
                                            disabled={total <= 0 ? true : false}
                                            onClick={() => this.setState({ total: total - 1 })}
                                            variant="danger"
                                        >-</Button>
                                        <h1>{total}</h1>
                                        <Button
                                            disabled={total >= stock ? true : false}
                                            onClick={() => this.setState({ total: total + 1 })}
                                            variant="primary"
                                        >+</Button>
                                    </div>
                                </div>
                            </div> */