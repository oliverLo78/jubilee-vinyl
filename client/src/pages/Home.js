import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css';

const Home = () => {
   return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section position-relative">
        <img 
          className='hero-image w-100' 
          src='/pexels-matthias-groeneveld-3916058.jpg' 
          alt='Vinyl record and equipment'
          style={{ display: 'flex' }}
        />
        <div className="hero-overlay position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className='hero-title display-4 fw-bold mb-4'>
            Design Your Custom Vinyl Today!
          </h1>
          <LinkContainer to="/search">
            <Button variant="primary" size="lg" className='hero-btn'>
              Get Started
            </Button>
          </LinkContainer>
        </div>
      </div>
      
      {/* About Section */}
      <Container className='my-5'>
        <Row className='align-items-center'>
          <Col md={6}>
            <img 
              className='img-fluid rounded shadow'
              src='/vinyll.jpg' 
              alt='Custom vinyl design'
              style={{ height: '300px', objectFit: 'cover', width: '100%' }}
            />
          </Col>
          <Col md={6}>
            <h2 className='mb-4'>About Jubilee</h2>
            <p className='lead'>
              We're a small team of developers who believe everyone should have access to 
              affordable custom vinyl records. While others charge $100+ per vinyl, we've 
              streamlined the process to offer quality custom pressings at a fraction of the cost.
            </p>
            <p>
              Balling on a budget? We get it. That's why we've made it our mission to make 
              custom vinyl accessible without compromising on quality or creativity.
            </p>
            <LinkContainer to="/about">
              <Button variant="outline-primary">Learn More</Button>
            </LinkContainer>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container fluid className='bg-light py-5'>
        <Row className='text-center'>
          <Col md={4} className='mb-4'>
            <div className='feature-icon mb-3'>🎵</div>
            <h4>Spotify Integration</h4>
            <p>Create vinyl from your favorite Spotify tracks instantly</p>
          </Col>
          <Col md={4} className='mb-4'>
            <div className='feature-icon mb-3'>🎨</div>
            <h4>Custom Designs</h4>
            <p>Choose colors, sizes, and create unique vinyl artwork</p>
          </Col>
          <Col md={4} className='mb-4'>
            <div className='feature-icon mb-3'>🚚</div>
            <h4>Fast Shipping</h4>
            <p>Get your custom vinyl delivered to your doorstep</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
