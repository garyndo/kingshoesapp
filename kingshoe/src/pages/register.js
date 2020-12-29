import React from 'react'
import Axios from 'axios'

import { Button, InputGroup, Form, FormControl, Modal } from 'react-bootstrap'

const URL = 'http://localhost:2000/users'

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            visible2: false,
            userValidErr: [false, ""],
            emailValidErr: [false, ""],
            passValidErr: [false, ""],
            regError: [false, ""]
        }
    }

    handleReg = () => {
        const { userValidErr, emailValidErr, passValidErr } = this.state
        let username = this.refs.username.value
        let email = this.refs.email.value
        let password = this.refs.password.value
        let confpassword = this.refs.confpassword.value
        // console.log(username, email, password, confpassword)

        if (!username || !email || !password || !confpassword) return this.setState({ regError: [true, "please input all form"] })

        if (confpassword !== password) return this.setState({ regError: [true, "Password doesn't match with Confirm Password"] })

        if (userValidErr[0] || emailValidErr[0] || passValidErr[0]) return this.setState({ regError: [true, "Make sure there is no error in validation"] })

        // console.log({
        //     username: username,
        //     password: password,
        //     role: "user",
        //     email: email
        // })

        // axios get untuk menyaring username 
        Axios.get(`${URL}?username=${username}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this username is already used"] })

                // axios get untuk menyaring email
                Axios.get(`${URL}?email=${email}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.length !== 0) return this.setState({ regError: [true, "Account with this email is already used"] })

                        // kalau tidak ada akun dengan username dan email yang sama, maka axios post akan berjalan
                        Axios.post('http://localhost:2000/users', {
                            username: username,
                            password: password,
                            role: "user",
                            email: email,
                            cart: []
                        })
                            .then((res) => {
                                console.log(res.data)
                                console.log('Register berhasil')
                                this.setState({ regError: [false, ""] })
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))

    }

    userValid = (e) => {
        let username = e.target.value //target=>properti dari event
        // console.log(username)
        let symb = /[!@#$%^&*;]/

        if (symb.test(username) || username.length < 6) return this.setState({ userValidErr: [true, "*cant include symb and min 6 char"] })

        this.setState({ userValidErr: [false, ""] })
    }
    emailValid = (e) => {
        let email = e.target.value
        // console.log(email)

        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!regex.test(email)) return this.setState({ emailValidErr: [true, "*Email not valid"] })

        this.setState({ emailValidErr: [false, ""] })
    }

    passValid = (e) => {
        let password = e.target.value
        // console.log(password)
        let symb = /[!@#$%^&*;]/
        let numb = /[0-9]/
        // let upper = /[A-Z]/

        if (!symb.test(password) || !numb.test(password) || password.length < 6) return this.setState({ passValidErr: [true, "*must include symbol, number,min 6 char"] })

        this.setState({ passValidErr: [false, ""] })
    }
    render() {
        const { visible, visible2, userValidErr, emailValidErr, passValidErr, regError } = this.state
        return (
            <div style={styles.container}>
                <div style={styles.center}>
                    <div>
                        <h1>REGISTIR NICH</h1>
                    </div>
                    <div style={{ ...styles.item, textAlign: 'center' }}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-user-circle"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                ref="username"
                                onChange={(e) => this.userValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {userValidErr[1]}
                        </Form.Text>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className="fas fa-envelope" />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                ref="email"
                                onChange={(e) => this.emailValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {emailValidErr[1]}
                        </Form.Text>
                        <InputGroup>
                            <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                                onClick={() => this.setState({ visible: !visible })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                type={visible ? "text" : "password"}
                                ref="password"
                                onChange={(e) => this.passValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                            {passValidErr[1]}
                        </Form.Text>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }}
                                onClick={() => this.setState({ visible2: !visible2 })}>
                                <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                    <i className={visible2 ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Confirm Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                style={{ height: "45px" }}
                                type={visible2 ? "text" : "password"}
                                ref="confpassword"
                            // onChange={(e) => this.emailValid(e)}
                            />
                        </InputGroup>
                        <Button onClick={this.handleReg}>
                            Register <i className="fas fa-user-plus" style={{ marginLeft: '10px' }}></i>
                        </Button>
                    </div>
                    <Modal show={regError[0]} onHide={() => this.setState({ regError: [false, ""] })}>
                        <Modal.Header closeButton>
                            <Modal.Title>ERROR</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{regError[1]}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.setState({ regError: [false, ""] })}>
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        background: "url(https://images.unsplash.com/photo-1516767254874-281bffac9e9a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80) no-repeat center",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        height: "100vh",
    },
    center: {
        marginTop: '100px',
        padding: '10px 30px',
        width: '350px',
        height: '60vh',
        backgroundColor: 'rgba(255, 255, 255, .4)',
        display: 'flex',
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid gray",
        borderRadius: "10px"
    },
    item: {
        width: '100%',
        height: 'auto',
        marginButtom: '5px'
    }
}

export default Register 