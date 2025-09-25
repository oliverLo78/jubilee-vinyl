import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "./header.css";

// Font Awesome imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle, faRecordVinyl, faUser } from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

import Auth from "../../utils/auth";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <Navbar expand="lg" className="jubilee-header">
      <Container>
        <Navbar.Brand href="/" className="jubilee-brand">
          <FontAwesomeIcon icon={faRecordVinyl} className="me-2" /> 
            🎵 Jubilee
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Item className="d-flex align-items-center me-4">
              <FontAwesomeIcon icon={faHome} className="jubilee-icon me-2" />

              <Nav.Link href="/" className="jubilee-nav-link">
                Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="d-flex align-items-center me-4">
              <FontAwesomeIcon icon={faPlusCircle} className="jubilee-icon me-2" />
              <Nav.Link href="/search" className="jubilee-nav-link">
                Create Vinyl
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item className="d-flex align-items-center me-4">
              <FontAwesomeIcon icon={faRecordVinyl} className="jubilee-icon me-2" />
              
              <Nav.Link href="/about" className="jubilee-nav-link">
                About Us
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Nav className="ms-auto">
            {Auth.loggedIn() ? (
              <div className="d-flex align-items-center">
                <Nav.Item className="d-flex align-items-center me-3">
                  <FontAwesomeIcon icon={faUser} className="jubilee-icon me-2" />
                  <Nav.Link href="/profile" className="jubilee-nav-link">
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Button onClick={logout} className="jubilee-auth-btn" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Button href="/login" className="jubilee-auth-btn me-2" size="sm">
                  Login
                </Button>
                <Button href="/signup" className="jubilee-auth-btn" size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

  
   


