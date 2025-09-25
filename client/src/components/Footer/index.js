import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMusic, faHeart, faRecordVinyl } from '@fortawesome/free-solid-svg-icons';
import { faSpotify, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import "./footer.css";

const Footer = () => {
  return (
     <footer className="jubilee-footer">
      <Container>
        <Row className="align-items-center">

           {/* Brand Section */}
          <Col lg={4} className="text-center text-lg-start">
            <div className="footer-brand">
                <FontAwesomeIcon icon={faRecordVinyl} className="me-2" size="lg" />  
              <span className="brand-text">🎵 Jubilee</span>
            </div>

              <p className="footer-tagline">Create custom vinyl from your favorite Spotify tracks</p>
          </Col>
          
          {/* Social Links Section */}
          <Col lg={4} className="text-center my-3 my-lg-0">
            <div className="social-icons">
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faSpotify} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="mailto:hello@jubilee.com" className="social-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </a>
            </div>
            <div className="footer-links mt-2">
              <a href="/about" className="footer-link">About</a>
              <a href="/contact" className="footer-link">Contact</a>
              <a href="/privacy" className="footer-link">Privacy</a>
              <a href="/terms" className="footer-link">Terms</a>
            </div>
          </Col>

          {/* Contact Info Section */}
          <Col lg={4} className="text-center text-lg-end">
            <div className="contact-info">
              <div className="contact-item">
                <FontAwesomeIcon icon={faMusic} className="me-2" />
                <span>hello@jubilee.com</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faHeart} className="me-2" />
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
