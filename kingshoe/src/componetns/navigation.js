import React from 'react'
import { Link } from 'react-router-dom'
import { Nav, Navbar, Dropdown, NavDropdown } from 'react-bootstrap'

import { LOGO } from '../assets'

class Navigation extends React.Component {
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
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Username
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to='/login'>login</Dropdown.Item>
                            <Dropdown.Item as={Link} to='/register'>register</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation