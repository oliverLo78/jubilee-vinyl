import React,{ useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AlbumSelector from '../components/AlbumSelector/index';
import './Home.css';

const Home = () => {
    const [showAlbumSelector, setShowAlbumSelector] = useState(false);
    const navigate = useNavigate();

    const handleAlbumSelect = (album) => {
      console.log('Selected album:', album);

      // Navigate to vinyl creation page
      const handleCreateVinyl = (track) => {
        navigate('/customize', { 
          state: { trackData: track }
      });
    };

    // navigate('/create-vinyl', { state: { album } });
    };

    const handleGetStarted = () => {
    navigate('/search');
    };

    const handleDemoCustomizer = () => {
    navigate('/customize', { 
      state: { 
        trackData: {
          name: "Demo Track",
          artist: "Demo Artist",
          album: "Demo Album"
        }
      }
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
          <h1>Create Custom Vinyl Records</h1>
          <p>Turn your favorite Spotify tracks into physical vinyl memories</p>
        <Button 
        variant="warning" 
        size="lg" 
        onClick={handleGetStarted}
        >
          🎵 Start Creating Now
        </Button>

        <Button 
         variant="outline-light"
        size="lg" 
        className="ms-3" 
        onClick={handleDemoCustomizer}
        >
          🎨 Try Customizer Demo
        </Button>

         <Button 
          variant="warning" 
          size="lg" 
          onClick={() => setShowAlbumSelector(true)}
          className="mt-4"
        >
          🎵 Browse Playlists & Create Vinyl
        </Button>
         
        <Button onClick={() => handleCreateVinyl(track)}>
          💽 Create Vinyl
        </Button>

      
        <div className="hero-overlay position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className='hero-title display-4 fw-bold mb-4'>
            Design Your Custom Vinyl Today!
          </h1>
          <LinkContainer to="/search">
            <Button variant="primary" size="lg" className='hero-btn'>
              Get Started
            </Button>
          </LinkContainer>

          {/* Album Selector Modal */}
          {showAlbumSelector && (
            <div className="album-selector-modal">
              <AlbumSelector 
                onAlbumSelect={handleAlbumSelect}
                onClose={() => setShowAlbumSelector(false)}
              />
            </div>
          )}
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
      <Container className="my-5">
        <Row>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">🔍</div>
            <h4>Search Spotify</h4>
            <p>Find your favorite tracks and playlists</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">🎨</div>
            <h4>Customize Design</h4>
            <p>Add images, text, and create unique artwork</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="feature-icon">📦</div>
            <h4>Order Vinyl</h4>
            <p>Get your custom vinyl delivered</p>
          </Col>
        </Row>
      </Container>
    </div>
  </div>
)};

export default Home;
