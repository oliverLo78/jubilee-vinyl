import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./header.css";
import {
  HomeIcon, 
  LibraryIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import Auth from "../../utils/auth";
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <Navbar expand="lg" className="jubilee-header">
      <Container>
        <Navbar.Brand href="/" className="jubilee-brand">
          <img id="img" src="/icon-192x192.png" height={50} className="me-2" />
          🎵 Jubilee
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="jubilee-toggler" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <LinkContainer to="/">
              <Nav.Link className="jubilee-nav-link">
                <HomeIcon className="jubilee-icon home-icon" />
                Home
              </Nav.Link>
            </LinkContainer>

            <Nav.Link href="/create-vinyl" className="jubilee-nav-link">
              <PlusCircleIcon className="jubilee-icon plus-icon" />
              Make Vinyl Record
            </Nav.Link>
            
            <Nav.Link href="/about" className="jubilee-nav-link">
              <LibraryIcon className="jubilee-icon library-icon" />
              About Us
            </Nav.Link>
          </Nav>

           <Nav>
            {Auth.loggedIn() ? (
              <>
                <Nav.Link href="/profile" className="jubilee-nav-link">
                  Profile
                </Nav.Link>
                <Button 
                  onClick={logout} 
                  className="jubilee-auth-btn"
                >
                  Logout
                </Button>
              </>
             ) : (
              <>
                <Button href="/login" className="jubilee-auth-btn me-2">
                  Login
                </Button>
                <Button href="/signup" className="jubilee-auth-btn">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

  
   


