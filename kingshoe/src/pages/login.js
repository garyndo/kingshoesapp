import React from 'react'
import {
    InputGroup,
    FormControl
} from 'react-bootstrap'

class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false
        }
    }
    render() {
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
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{cursor:'pointer', width:'40px'}} onClick={() => this.setState({ visible: !visible })}>
                                <InputGroup.Text id="basic-addon1">
                                    {visible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i> } 
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Password" 
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                type={visible ? "text" : "password"}
                            />
                        </InputGroup>
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

export default Login 