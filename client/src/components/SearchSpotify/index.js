import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Alert
} from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { SEARCH_SPOTIFY_TRACKS } from '../../utils/queries';
import { useSpotify } from '../../utils/SpotifyContext';
import { VinylOrderForm } from '../VinylOrderForm/index.js'

function SearchSpotify() {
  const [searchInput, setSearchInput] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const { spotifyToken, isPremium, loginToSpotify } = useSpotify();

  const { loading, error, data, refetch } = useQuery(SEARCH_SPOTIFY_TRACKS, {
    variables: { query: searchInput, limit: 12 },
    skip: !searchExecuted || !searchInput.trim(),
  });

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
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

  if (!spotifyToken) {
    return (
      <Container className="text-center my-5">
        <Alert variant="info">
          <h4>Connect to Spotify</h4>
          <p>You need to connect your Spotify account to search for tracks</p>
          <Button onClick={loginToSpotify} variant="primary">
            Connect Spotify
          </Button>
        </Alert>
      </Container>
    );
  }

  const tracks = data?.searchSpotifyTracks?.tracks?.items || [];

  return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center mb-4">Search Spotify Tracks</h2>
          
            <InputGroup className="mb-4">
              <FormControl
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

          {error && (
            <Alert variant="danger" className="text-center">
              Error searching tracks: {error.message}
            </Alert>
          )}

          {searchExecuted && tracks.length === 0 && !loading && (
            <Alert variant="info" className="text-center">
              No tracks found. Try a different search term.
            </Alert>
          )}

          <Row>
            {tracks.map((track) => (
              <Col key={track.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 track-card">
                  <Card.Img 
                    variant="top" 
                    src={track.album.images[0]?.url || '/default-album.jpg'}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6" title={track.name}>
                      {track.name.length > 50 
                        ? `${track.name.substring(0, 50)}...` 
                        : track.name
                      }
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </Card.Text>
                    <Card.Text className="text-muted small">
                      {track.album.name}
                    </Card.Text>
                    <div className="mt-auto">
                      {isPremium && track.preview_url && (
                        <audio 
                          controls 
                          className="w-100 mb-2"
                          src={track.preview_url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      )}
                        
                      {tracks.map(track => (
                        <TrackSelector 
                          key={track.id} 
                          track={track}
                          onTrackAdded={() => {
                            // Refresh favorites list or show confirmation
                            console.log('Track added to favorites!');
                          }}
                        />
                      ))}
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-100"
                        onClick={() => {
                          navigate('/create-vinyl', { 
                            state: { 
                              trackData: {
                                id: track.id,
                                name: track.name,
                                artist: track.artists[0].name,
                                image: track.album.images[0]?.url,
                                album: track.album.name,
                                previewUrl: track.preview_url
                              }
                            }
                          });
                        }}
                      >
                        Create Vinyl
                      </Button>

                       </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchSpotify;
