// client/src/pages/SearchSpotify.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  InputGroup, 
  Alert, 
  Spinner,
  Badge 
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_SPOTIFY_TRACKS } from '../utils/queries';
import { useSpotify } from '../utils/SpotifyContext';
import Auth from '../utils/auth';
import './SearchSpotify.css';

const SearchSpotify = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const { spotifyToken, loginToSpotify, isConnected } = useSpotify();
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(SEARCH_SPOTIFY_TRACKS, {
    variables: { 
      query: searchInput, 
      type: 'track', 
      limit: 20 
    },
    skip: !searchExecuted || !searchInput.trim() || !spotifyToken,
  });

  const handleSearch = () => {
    if (!searchInput.trim()) {
      alert('Please enter a search term');
      return;
    }

    if (!spotifyToken) {
      loginToSpotify();
      return;
    }

    setSearchExecuted(true);
    refetch({ query: searchInput });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

   const handleCreateVinyl = (track) => {
    navigate('/customize', { 
      state: { 
        trackData: {
          id: track.id,
          name: track.name,
          artist: track.artists[0]?.name,
          album: track.album?.name,
          image: track.album?.images[0]?.url,
          previewUrl: track.preview_url
        }
      }
    });
  };

   // Test data for demonstration
  const testTracks = [
    {
      id: 'test-1',
      name: 'Bohemian Rhapsody',
      artists: [{ name: 'Queen' }],
      album: { 
        name: 'A Night at the Opera',
        images: [{ url: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png' }]
      },
      preview_url: null
    },
    {
      id: 'test-2', 
      name: 'Blinding Lights',
      artists: [{ name: 'The Weeknd' }],
      album: {
        name: 'After Hours',
        images: [{ url: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png' }]
      },
      preview_url: null
    },
    {
      id: 'test-3',
      name: 'Levitating',
      artists: [{ name: 'Dua Lipa' }],
      album: {
        name: 'Future Nostalgia', 
        images: [{ url: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png' }]
      },
      preview_url: null
    }
  ];

    const tracks = data?.searchSpotifyTracks?.tracks?.items || testTracks;

    if (!Auth.loggedIn()) {
    return (
      <Container className="text-center py-5">
        <Alert variant="warning">
          <h4>Authentication Required</h4>
          <p>Please log in to search for tracks and create vinyl records.</p>
          <Button variant="primary" href="/login" className="me-2">Login</Button>
          <Button variant="outline-primary" href="/signup">Sign Up</Button>
        </Alert>
      </Container>
    );
  }

   return (
    <Container className="search-spotify-container py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="search-header text-center mb-5">
            <h1>Search Spotify Tracks</h1>
            <p className="lead">Find your favorite songs to create custom vinyl records</p>
            
            <div className="connection-status mb-3">
              {isConnected ? (
                <Badge bg="success" className="p-2">
                  ✅ Connected to Spotify
                </Badge>
              ) : (
                <Badge bg="warning" className="p-2">
                  🔄 Connect Spotify to Search
                </Badge>
              )}
            </div>
          </div>

           {/* Search Input */}
          <Card className="search-card mb-4">
            <Card.Body>
              <InputGroup size="lg">
                <Form.Control
                  placeholder="Search for songs, artists, or albums..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button 
                  variant="primary" 
                  onClick={handleSearch}
                  disabled={loading || !searchInput.trim()}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
                </Button>
              </InputGroup>

              {!spotifyToken && (
                <Alert variant="info" className="mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Connect your Spotify account to search</span>
                    <Button variant="outline-primary" onClick={loginToSpotify}>
                      Connect Spotify
                    </Button>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>

           {/* Search Results */}
          {searchExecuted && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  Search Results {data && `(${tracks.length} tracks found)`}
                </h5>
              </Card.Header>
              <Card.Body>
                {error && (
                  <Alert variant="danger">
                    <h6>Search Error</h6>
                    <p className="mb-0">{error.message}</p>
                    <hr />
                    <p className="mb-0 small">
                      <strong>Demo Mode:</strong> Showing sample tracks for presentation
                    </p>
                  </Alert>
                )}

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" className="mb-3">
                      <span className="visually-hidden">Searching...</span>
                    </Spinner>
                    <p>Searching Spotify...</p>
                  </div>
                ) : tracks.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <h6>No tracks found</h6>
                    <p className="mb-0">
                      Try a different search term or check your Spotify connection.
                    </p>
                  </Alert>
                ) : (
                  <Row>
                    {tracks.map((track) => (
                      <Col key={track.id} md={6} lg={4} className="mb-4">
                        <Card className="track-card h-100">
                          <Card.Img 
                            variant="top" 
                            src={track.album?.images[0]?.url || '/default-album.jpg'}
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300/1a1a1a/ffffff?text=🎵';
                            }}
                          />

                          <Card.Body className="d-flex flex-column">
                            <Card.Title 
                              className="track-title"
                              title={track.name}
                            >
                              {track.name.length > 40 
                                ? `${track.name.substring(0, 40)}...` 
                                : track.name
                              }
                            </Card.Title>
                            <Card.Text className="track-artist text-muted">
                              by {track.artists[0]?.name || 'Unknown Artist'}
                            </Card.Text>
                            <Card.Text className="track-album small text-muted">
                              {track.album?.name}
                            </Card.Text>
                            
                            <div className="mt-auto">
                              {track.preview_url && (
                                <audio 
                                  controls 
                                  src={track.preview_url} 
                                  className="w-100 mb-2"
                                >
                                  Your browser does not support audio preview.
                                </audio>
                              )}

                              <Button 
                                variant="success" 
                                className="w-100"
                                onClick={() => handleCreateVinyl(track)}
                              >
                                Create Vinyl
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          )}

           {/* Demo Instructions */}
          {!searchExecuted && (
            <Card className="mt-4">
              <Card.Header>
                <h6 className="mb-0">Demo Instructions</h6>
              </Card.Header>
              <Card.Body>
                <ul className="mb-0">
                  <li>Enter a song name, artist, or album in the search bar</li>
                  <li>Click "Search" or press Enter</li>
                  <li>Connect Spotify if prompted</li>
                  <li>Click "Create Vinyl" on any track to start designing</li>
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchSpotify;





