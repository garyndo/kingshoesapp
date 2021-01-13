import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
// import { Link, Redirect } from 'react-router-dom'
import { Table, Button, Image, Form, Modal } from 'react-bootstrap'

import { login } from '../action'

class Cartpage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: null,
            newQty: 0,
            reqPayment: false,
            total: 0,
            reqPass: false,
            errPass: false
        }
    }
    handleDelete = (index) => {
        // console.log(index) => untuk cek index ke brapa terpilih ketika kita pencet del
        // kita pake axios.patch, karena kita akan ganti data lama dengan data baru, 
        //tidak bisa pake axios delete karna kita mau elete hanya cartnya
        //pake splice,untuk menghapus index k sekian  
        //buat tempCart untuk menampung data cart 
        let tempCart = this.props.cart
        tempCart.splice(index, 1) // index dsni kita menghapus cart sesuai yg kita inginkan sebanyal 1
        console.log(tempCart)
        //edit dengan axios patch dan panggil id dari redux
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`) // agar otomatis k delete, tidak perlu d refresh/d reload
                    .then((res) => this.props.login(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))

    }
    handleDone = (index) => {
        //1.MENGGANTI DATA PESANAN SUATU PRODUK BERDASARKAN INDEX
        //cart ada yg d ganti, manipulasi cart,
        //ambil data yg mau kita edit dr REDUX
        //tempproduct tempat penyimpnan semntara data product yg ingin d edit 
        let tempProduct = this.props.cart[index]
        //kita ganti quantity dan product, mengganti data cart/pesanan untuk product yg ingin d ganti  
        tempProduct.qty = this.state.newQty //mengganti isi quantity dengan yg baru 
        tempProduct.total = this.state.newQty * this.props.cart[index].price //update atau mengganti totalprice
        console.log(tempProduct)

        //2. MEMASUKAN OBJEK PSEANAN YG BARU(TEMP PRODUCT) K DALAM ARRAY CART
        //tempcart adalah tmpat penampungan smntara data cart yg lama 
        let tempCart = this.props.cart //panggil array/cart yg lama 
        tempCart.splice(index, 1, tempProduct) // kita ganti datanya tempcart yg lama dengan tempproduct berisi cart yg baru setelah dedit 
        //NOTE splice bisa untuk mengganti dengan 3 parameter dan bs jg untk menghapus dengan 2 parameter 
        console.log(tempCart)

        //3. setelah manipulasi data cart. kita PUSH K DATABASE
        //KIRIM PERUBAHAN K DATABASE JSON REDUX NIH BOY
        // GANTI K DATABASE PAKE AXIOS CATCH, UPDATE PAKE AXIOS GET
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                //update data d redux 
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedIndex: null }) // mengubah row tabel seperti semula 
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }
    handleMinus = () => {
        if (this.state.newQty <= 0) return
        this.setState({ newQty: this.state.newQty - 1 })
    }
    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }

    totalPrice = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.total)
        console.log(counter)
        return counter
    }
    confPay = () => {
        let nominal = this.refs.payment.value //nampung inputan dr user
        console.log(nominal)
        this.setState({ reqPayment: false }) //modal ketutup
    }
    confPass = () => {
        let pass = this.refs.pass.value
        console.log(pass)
        //if conditional, passnya sama ga/ketika pass tidak sesuai 
        if (pass !== this.props.pass) return this.setState({ errPass: true })

        this.setState({reqPayment:true,reqPass:false})
    }
    renderTHead = () => {
        return (
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>action</th>
                </tr>
            </thead>
        )
    }
    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => { //menggunakan maping untuk memanggil data yg ada ddlmcart user yg sudah memilih
                    if (this.state.selectedIndex === index) {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>
                                    <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                                </td>
                                <td>{item.size}</td>
                                <td>IDR {item.price.toLocaleString()}</td>
                                <td style={{ display: 'flex' }}>
                                    <Button onClick={this.handleMinus}>-</Button>
                                    <Form.Control style={{ width: '100px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} />
                                    <Button onClick={() => this.setState({ newQty: parseInt(this.state.newQty) + 1 })}>+</Button>
                                </td>
                                <td>IDR {(this.state.newQty * item.price).toLocaleString()}</td>
                                <td>
                                    <Button onClick={() => this.handleDone(index)} variant='success'>Done</Button>
                                    <Button onClick={() => this.setState({ selectedIndex: null })} variant='info'>Cancel</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                            </td>
                            <td>{item.size}</td>
                            <td>IDR {item.price.toLocaleString()}</td>
                            <td>{item.qty}</td>
                            <td>IDR {item.total.toLocaleString()}</td>
                            <td>
                                <Button onClick={() => this.setState({ selectedIndex: index, newQty: item.qty })} variant='warning'>Edit</Button>
                                <Button onClick={() => this.handleDelete(index)} variant='danger'>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    render() {
        const { reqPayment, reqPass, errPass } = this.state
        if (!this.props.id) return <Redirect to='/login' />
        // console.log(this.props.cart) //caramanggil redux,dan kita liat dapet ga datanya, make sure datanya terpanggil
        // console.log(this.state.selectedIndex)
        return (

            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Welcome to Your Cart Page </h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={()=> this.setState({ reqPass: true })} variant='success'>CheckOut</Button>
                    </div>
                </div>
                <Table striped bordered hover variant="dark">
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
                <h1>total belanja anda = IDR {(this.totalPrice().toLocaleString())}</h1>
                <Modal show={reqPayment} onHide={() => this.setState({ reqPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>USER PAYMENT</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref='payment' type='number' placeholder='Please input ur money for payment' />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPayment: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPay}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={reqPass} onHide={() => this.setState({ reqPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>INPUT YOU PASSWORD</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref='pass' type='password' placeholder='Please input ur password for payment' />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPass: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPass}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPass} onHide={() => this.setState({ errPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>ERROR</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        WRONG PASSWORD
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPass: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id,
        pass: state.user.password
    }
}

export default connect(mapStateToProps, { login })(Cartpage) //connect