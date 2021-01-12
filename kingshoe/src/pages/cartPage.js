import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
// import { Link, Redirect } from 'react-router-dom'
import { Table, Button, Image } from 'react-bootstrap'

import { login } from '../action'

class Cartpage extends React.Component {
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
                    .catch((err)=>console.log(err)) 
            })
            .catch((err) => console.log(err))

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
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>
                                <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                            </td>
                            <td>{item.size}</td>
                            <td>{item.price}</td>
                            <td>{item.qty}</td>
                            <td>{item.total}</td>
                            <td>
                                <Button variant='warning'>Edit</Button>
                                <Button onClick={() => this.handleDelete(index)} variant='danger'>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }
    render() {
        console.log(this.props.cart) //caramanggil redux,dan kita liat dapet ga datanya, make sure datanya terpanggil
        return (
            <div style={{ padding: '0 20px' }}>
                <h1>Welcome to Your Cart Page </h1>
                <Table striped bordered hover variant="dark">
                    {this.renderTHead()}
                    {this.renderTBody()}
                </Table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id
    }
}

export default connect(mapStateToProps, { login })(Cartpage) //connect