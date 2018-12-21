import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = props => {
  return (
    <header>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Diamond Calculator</Link>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    </header>
  );
};

export default Header;
