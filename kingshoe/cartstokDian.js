import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Redirect,
    Link,
} from 'react-router-dom'

import { login } from '../action'

import {
    Table,
    Button,
    FormControl,
    Modal,
    Dropdown
} from 'react-bootstrap'

class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            selectedIndex: null,
            productId: "",
            qty: 0,
            size: null,
            checkQty: false,
            cartEmp: false,
            reqPassword: false,
            errPassword: false,
            reqPayment: false,
            errPayment: false,
            toHistory: false
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/products`)
            .then((res) => this.setState({ products: res.data }))
            .catch((err) => console.log(err))
    }

    deleteItemHandler = (index) => {
        let tempCart = this.props.cart

        // console.log(tempCart)
        tempCart.splice(index, 1)
        // console.log(tempCart)

        // console.log(this.props.id)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                // console.log(res.data)

                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res2) => this.props.login(res2.data))
                    .catch((err2) => console.log(err2))
            })
            .catch((err) => console.log(err))
    }

    editItemHandler = (index, qty, productId, size) => {
        // console.log(`edit clicked index: ${index} qty: ${qty} name: ${name}`)
        this.setState({ selectedIndex: index, qty: qty, productId: productId, size: size })
    }

    changeQty = (e) => {
        this.setState({ qty: e.target.value })
    }

    changeSize = (e) => {
        const { products, productId, size } = this.state

        this.setState({ size: parseInt(e.target.textContent) })

        const product = products.filter(item => item.id === productId)
        const stock = product[0].stock.filter(item => item.code === size)

        this.setState({ qty: stock[0].total })
    }

    minusHandler = () => {
        if (this.state.qty <= 0) return

        this.setState({ qty: this.state.qty - 1 })
    }

    plusHandler = () => {
        const { products, productId, qty, size } = this.state

        const product = products.filter(item => item.id === productId)
        console.log(product)


        const stock = product[0].stock.filter(item => item.code === size)
        console.log(stock)
        // console.log(typeof(size))

        if (qty >= stock[0].total) return this.setState({ checkQty: true })
        this.setState({ qty: qty + 1 })
    }

    doneHandler = (index) => {
        // console.log("done clicked " + index)
        const { products, productId, qty, size } = this.state

        const product = products.filter(item => item.id === productId)
        const stock = product[0].stock.filter(item => item.code === size)
        if (qty > stock[0].total) return this.setState({ checkQty: true })

        let tempProduct = this.props.cart[index]
        tempProduct.size = parseInt(this.state.size)
        tempProduct.qty = parseInt(this.state.qty)
        tempProduct.totalPrice = parseInt(this.state.qty) * this.props.cart[index].price

        // menambahkan qty baru ke dalam array cart
        let tempCart = this.props.cart
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        // kirim perubahan ke database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                // console.log(res.data)

                // update data di globalstate
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res2) => this.props.login(res2.data))
                    .catch((err2) => console.log(err2))

                this.setState({ selectedIndex: null })
            })
            .catch((err) => console.log(err))
    }

    countTotal = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.totalPrice)
        return counter
    }

    checkoutHandler = () => {
        if (this.props.cart.length === 0) return this.setState({ cartEmp: true })
        this.setState({ reqPassword: true })
    }

    confirmPasswordHandler = () => {
        let confpassword = this.refs.confpassword.value
        // console.log("confirm password clicked " + confpassword)

        if (confpassword !== this.props.password) return this.setState({ errPassword: true })

        this.setState({ reqPassword: false, reqPayment: true })
    }

    confirmPaymentHandler = () => {
        let payment = this.refs.payment.value

        let orderTotal = this.countTotal()

        if (payment < orderTotal) return this.setState({ errPayment: true })

        let tempCart = this.props.cart
        console.log(tempCart)
        let tempProduct = this.state.products
        console.log(tempProduct[0].stock)

        let updateProduct = []
        for (let cart of tempCart) {
            for (let products of tempProduct) {
                if (cart.id === products.id) updateProduct.push(products)
            }
        }
        console.log(updateProduct)

        let updateStock = []
        for (let i in updateProduct) {
            for (let product of updateProduct[i].stock) {
                for (let cart of tempCart) {
                    if (cart.name === updateProduct[i].name && product.code === cart.size) {
                        let update = {
                            id: cart.id,
                            size: cart.size,
                            updatedTotal: product.total - cart.qty
                        }
                        updateStock.push(update)
                    }
                }
            }
        }
        console.log(updateStock)

        for (let update of updateStock) {
            Axios.get(`http://localhost:2000/products/${update.id}`)
                .then((res) => {
                    let tempStock = res.data.stock
                    // console.log(tempStock)
                    tempStock.forEach(item => {
                        // console.log(item.code, update.size)
                        if (item.code === update.size) {
                            item.total = update.updatedTotal
                        }
                    })
                    // console.log(tempStock)
                    Axios.patch(`http://localhost:2000/products/${update.id}`, { stock: tempStock })
                        .then((res) => {
                            console.log(res.data)
                        })
                        .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err))
        }

        let history = {
            username: this.props.username,
            date: new Date().toLocaleString(),
            total: orderTotal,
            product: this.props.cart
        }

        Axios.post(`http://localhost:2000/history`, history)
            .then((res) => {
                console.log(res.data)

                // clear cart
                Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: [] })
                    .then((res) => {
                        console.log(res.data)

                        // update redux
                        Axios.get(`http://localhost:2000/users/${this.props.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({ reqPayment: false, toHistory: true })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    renderThead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>No</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTbody = () => {
        const { selectedIndex, qty, size } = this.state
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td style={{ textAlign: "center" }}>
                                <img src={item.image} alt={item.name} style={styles.imgCart} />
                            </td>
                            <td>
                                {
                                    selectedIndex === index
                                        ?
                                        <div>
                                            <p>{item.name}</p>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                    {size ? size : "Size..."}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        <div onClick={(e) => this.changeSize(e)}>38</div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <div onClick={(e) => this.changeSize(e)}>39</div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <div onClick={(e) => this.changeSize(e)}>40</div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <div onClick={(e) => this.changeSize(e)}>41</div>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <div onClick={(e) => this.changeSize(e)}>42</div>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        :
                                        <div>
                                            <p>{item.name}</p>
                                            <p style={{ fontWeight: "600" }}>Size: {item.size} </p>
                                        </div>
                                }
                            </td>
                            <td>IDR. {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>
                                {
                                    selectedIndex === index
                                        ?
                                        <div style={{ display: "flex", width: "200px" }}>
                                            <Button onClick={this.minusHandler}>
                                                <i className="fas fa-minus-circle"></i>
                                            </Button>

                                            <FormControl type="text" value={qty} onChange={(e) => this.changeQty(e)} />

                                            <Button onClick={this.plusHandler}>
                                                <i className="fas fa-plus-circle"></i>
                                            </Button>
                                        </div>
                                        :
                                        item.qty
                                }
                            </td>
                            <td>
                                {
                                    selectedIndex === index
                                        ?
                                        <p>IDR. {(qty * item.price).toLocaleString()}</p>
                                        :
                                        <p>IDR. {item.totalPrice.toLocaleString()}</p>
                                }
                            </td>
                            <td style={{ textAlign: "center" }}>
                                {
                                    selectedIndex === index
                                        ?
                                        <div>
                                            <Button style={{ margin: "5px", backgroundColor: "#ef233c" }} onClick={() => this.setState({ selectedIndex: null })}><i className="fas fa-window-close"></i></Button>
                                            <Button style={{ margin: "5px", backgroundColor: "#55a630" }} onClick={() => this.doneHandler(index)}><i className="fas fa-check-square"></i></Button>
                                        </div>
                                        :
                                        <div>
                                            <Button style={{ margin: "5px", backgroundColor: "#457b9d" }} onClick={() => this.editItemHandler(index, item.qty, item.id, item.size)}><i className="fas fa-edit"></i></Button>
                                            <Button style={{ margin: "5px", backgroundColor: "#ef233c" }} onClick={() => this.deleteItemHandler(index)}><i className="fas fa-trash-alt"></i></Button>
                                        </div>
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    renderSumary = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ marginTop: "40px" }}>
                    <Button as={Link} to="/" style={{ backgroundColor: "#feeafa", color: "black" }}>Continue Shopping</Button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: "25vw", height: "100px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h4>Order Total</h4>
                        <h4>IDR. {this.countTotal().toLocaleString()}</h4>
                    </div>
                    <Button style={{ backgroundColor: "#fca311" }} onClick={this.checkoutHandler} disabled={this.state.cartEmp}>Checkout</Button>
                </div>
            </div>
        )
    }

    render() {
        // console.log(this.state.products.length)

        if (!this.props.id) return <Redirect to="/login" />

        if (this.state.toHistory) return <Redirect to='/history' />

        return (
            <div style={styles.container}>
                <Table striped bordered hover>
                    {this.renderThead()}
                    {this.renderTbody()}
                </Table>
                {this.renderSumary()}

                <Modal show={this.state.checkQty} onHide={() => this.setState({ checkQty: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sorry🙏</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Your order is over our stock😢
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ checkQty: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.reqPassword} onHide={() => this.setState({ reqPassword: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl ref="confpassword" type="password" placeholder="Please enter your password to continue checkout" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPassword: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confirmPasswordHandler}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.errPassword} onHide={() => this.setState({ errPassword: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error❗</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Wrong password!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPassword: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.reqPayment} onHide={() => this.setState({ reqPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl ref="payment" type="number" placeholder="Please enter amount of your payment" />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPayment: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confirmPaymentHandler}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.errPayment} onHide={() => this.setState({ errPayment: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error❗</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Sorry, your entered payment is insufficient
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPayment: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    container: {
        padding: "0 30px",
        marginTop: "100px",
        fontFamily: "PT Serif"
    },
    imgCart: {
        width: "100px",
        height: "100px"
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.user.id,
        username: state.user.username,
        password: state.user.password,
        cart: state.user.cart,
    }
}

export default connect(mapStateToProps, { login })(Cart)