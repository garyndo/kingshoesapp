import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Dropdown } from 'react-bootstrap'
import { connect } from 'react-redux'
import { LOGO } from '../assets'
import { logout } from '../action'

class Navigation extends React.Component {
    handlelogout = () => {
        this.props.logout()
        localStorage.removeItem('username')
    }
    render() {
        return (
            <Navbar expand="lg" style={{ height: '70px', backgroundColor: '#7f0000' }}>
                <Navbar.Brand>
                    <image src={LOGO.default} alt='logo' />
                    <strong> King Shoes </strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/'>
                            <strong>Home</strong>
                        </Nav.Link>
                    </Nav>
                    <Link to='./cartpage'>
                    <i style={{ marginRight: '40px', color: 'white', fontSize:'20px'}} className="fas fa-shopping-cart"></i>
                    </Link>
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            {this.props.username ? this.props.username : 'username'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.props.username
                                ?
                                <>
                                <Dropdown.Item onClick={ this.handlelogout } as={Link} to='/login'>logout</Dropdown.Item>
                                <Dropdown.Item as={Link} to='/history'>History</Dropdown.Item>
                                </>
                                :
                                <>
                                    <Dropdown.Item as={Link} to='/login'>login</Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/register'>register</Dropdown.Item>
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username
    }
}

export default connect(mapStateToProps, { logout })(Navigation)