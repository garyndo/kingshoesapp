import React from 'react'
import Axios from 'axios'

import {
    InputGroup,
    FormControl,
    Button
} from 'react-bootstrap'

import { connect } from 'react-redux'

import { login } from '../action'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            visible: false
        }
    }

    handleLogin = () => {
        let username = this.refs.username.value
        let password = this.refs.password.value
        console.log(username, password)

        if (!username || !password) return alert('input tidak boleh kosong')

        Axios.get(`http://localhost:2000/users?username=${username}&password=${password}`)
            .then((res) => {
                console.log(res.data)

                if (res.data.length === 0) return alert('invalid username or pass')

                this.props.login(res.data[0])
                localStorage.username = username
            })
            .catch((err) => console.log(err))
    }
    render() {
        console.log(this.state.users)
        const { visible } = this.state
        return (
            <div style={styles.container}>
                <div style={styles.center}>
                    <div>
                        <h1>LOGIN</h1>
                    </div>
                    <div>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <i className="fas fa-user"></i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                ref="username"
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{ cursor: 'pointer', width: '40px' }} onClick={() => this.setState({ visible: !visible })}>
                                <InputGroup.Text id="basic-addon1">
                                    {visible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                type={visible ? "text" : "password"}
                                ref="password"
                            />
                        </InputGroup>
                        <Button onClick={this.handleLogin} style={{ margin: '0px 100px' }} variant="dark">Submit</Button>{' '}
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: '90vh',
        background: "url(https://images.unsplash.com/photo-1516767254874-281bffac9e9a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80) no-repeat center",
        backgroundSize: 'cover'
    },
    center: {
        marginTop: '100px',
        padding: '10px 30px',
        width: '350px',
        height: '50vh',
        backgroundColor: 'rgba(255, 255, 255, .4)',
        borderRadius: '10px'
    }
}

export default connect(null, { login })(Login)