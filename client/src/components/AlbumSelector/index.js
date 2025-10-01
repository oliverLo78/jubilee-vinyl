// client/src/components/AlbumSelector/index.js
import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './AlbumSelector.css';

// Mock data - replace with actual Spotify API data
const mockAlbums = [
  {
    id: 1,
    title: "Current Favorites",
    artist: "Your Top Mix",
    image: "/default-album-1.jpg",
    type: "playlist",
    trackCount: 30
  },
  {
    id: 2,
    title: "Chill Vibes",
    artist: "Spotify",
    image: "/default-album-2.jpg",
    type: "playlist", 
    trackCount: 25
  },
  {
    id: 3,
    title: "Workout Hits",
    artist: "Your Library",
    image: "/default-album-3.jpg",
    type: "playlist",
    trackCount: 40
  },
  {
    id: 4,
    title: "Throwback Jams",
    artist: "Various Artists", 
    image: "/default-album-4.jpg",
    type: "playlist",
    trackCount: 35
  },
  {
    id: 5,
    title: "Discover Weekly",
    artist: "Spotify",
    image: "/default-album-5.jpg",
    type: "playlist",
    trackCount: 30
  },
  {
    id: 6,
    title: "Rock Classics",
    artist: "Various Artists",
    image: "/default-album-6.jpg", 
    type: "playlist",
    trackCount: 28
  }
];

const AlbumSelector = ({ onAlbumSelect, onClose }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const scrollRef = useRef(null);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    if (onAlbumSelect) {
      onAlbumSelect(album);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

   return (
    <Container className="album-selector-container">
      <Row>
        <Col>
          <div className="selector-header">
            <h3>Select a Playlist</h3>
            <p>Choose a playlist to create vinyl from</p>
            {onClose && (
              <Button variant="outline-secondary" onClick={onClose} className="close-btn">
                ×
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="scroll-container">
            <Button variant="outline-primary" className="scroll-btn left" onClick={scrollLeft}>
              ‹
            </Button>
            
            <div className="albums-scroll" ref={scrollRef}>
              {mockAlbums.map(album => (
                <Card 
                  key={album.id}
                  className={`album-card ${selectedAlbum?.id === album.id ? 'selected' : ''}`}
                  onClick={() => handleAlbumClick(album)}
                >
                  <Card.Img 
                    variant="top" 
                    src={album.image} 
                    alt={album.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150/1a1a1a/ffffff?text=🎵';
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="album-title">{album.title}</Card.Title>
                    <Card.Text className="album-artist">{album.artist}</Card.Text>
                    <div className="album-meta">
                      <span className="album-type">{album.type}</span>
                      <span className="track-count">{album.trackCount} tracks</span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <Button variant="outline-primary" className="scroll-btn right" onClick={scrollRight}>
              ›
            </Button>
          </div>
        </Col>
      </Row>

       {selectedAlbum && (
        <Row className="mt-4">
          <Col className="text-center">
            <div className="selection-confirmation">
              <h5>Selected: {selectedAlbum.title}</h5>
              <p>by {selectedAlbum.artist}</p>
              <Button variant="success" size="lg">
                Create Vinyl from this Playlist
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default AlbumSelector;