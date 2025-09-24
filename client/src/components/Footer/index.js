import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./footer.css";

// Social Media Icons (using Heroicons or you can use Font Awesome)
import { 
  EnvelopeIcon, 
  MusicalNoteIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

// Social Media Icons (using SVG or you can install react-icons)
const SocialIcons = () => {
  return (
    <div className="social-icons">
      {/* Spotify */}
      <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-2-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>

  {/* Instagram */}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>

     {/* Twitter/X */}
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      </a>

  {/* Email */}
      <a href="mailto:hello@jubilee.com" className="social-icon">
        <EnvelopeIcon className="icon-size" />
      </a>
    </div>
  );
};

const Footer = () => {
  return (
     <footer className="jubilee-footer">
      <Container>
        <Row className="align-items-center"></Row>
           {/* Brand Section */}
          <Col lg={4} className="text-center text-lg-start">
            <div className="footer-brand">
              <img src="/icon-192x192.png" height={40} alt="Jubilee Logo" className="me-2" />
              <span className="brand-text">🎵 Jubilee</span>
            </div>
              <p className="footer-tagline">Create custom vinyl from your favorite Spotify tracks</p>
          </Col>
          
          {/* Social Links Section */}
          <Col lg={4} className="text-center my-3 my-lg-0">
            <SocialIcons />
            <div className="footer-links mt-2">
              <a href="/about" className="footer-link">About</a>
              <a href="/contact" className="footer-link">Contact</a>
              <a href="/privacy" className="footer-link">Privacy</a>
              <a href="/terms" className="footer-link">Terms</a>
            </div>
          </Col>

          {/* Contact Info Section */}
          <Row>
            <Col lg={4} className="text-center text-lg-end">
              <div className="contact-info">
                <div className="contact-item">
                  <MusicalNoteIcon className="icon-size me-2" />
                  <span>hello@jubilee.com</span>
                </div>
                <div className="contact-item">
                  <HeartIcon className="icon-size me-2" />
                  <span>Made with love for music lovers</span>
                </div>
              </div>
            </Col>
          </Row>

         {/* Copyright Section */}
        <Row>
          <Col className="text-center">
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Jubilee Vinyl Creations. All rights reserved.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
