import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, Card, Form, Alert, Row, Col } from 'react-bootstrap';
import { ADD_FAVORITE_TRACK } from '../../utils/mutations';
import { QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';

// New Concept (TrackSelector)
const TrackSelector = ({ track, onTrackAdded }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  // ADD_FAVORITE_TRACK mutation
  const [addFavoriteTrack, { error, loading }] = useMutation(ADD_FAVORITE_TRACK, {
    update(cache, { data: { addFavoriteTrack } }) {
      try {
        // Update me object's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, favoriteTracks: addFavoriteTrack.favoriteTracks } },
        });
      } catch (e) {
        console.error('Error updating cache:', e);
      }
    },
  });

  const handleAddToFavorites = async () => {
    if (!Auth.loggedIn()) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      await addFavoriteTrack({
        variables: {
          trackId: track.id,
          trackName: track.name,
          artistName: track.artists[0].name,
          albumName: track.album.name,
          albumImage: track.album.images[0]?.url
        }
      });
      
      setIsFavorite(true);
      if (onTrackAdded) onTrackAdded();
      
    } catch (err) {
      console.error('Error adding to favorites:', err);
    }
  };

  const handleCreateVinyl = () => {
    // This would navigate to the vinyl creation form
    // You'll implement this based on your routing
    window.location.href = `/create-vinyl?trackId=${track.id}&name=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artists[0].name)}`;
  };

  if (!track) {
    return (
      <Alert variant="info">
        Select a track to see options
      </Alert>
    );
  }

  return (
    <Card className="track-selector mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={2}>
            <img 
              src={track.album.images[0]?.url} 
              alt={track.album.name}
              className="img-fluid rounded"
              style={{ width: '64px', height: '64px', objectFit: 'cover' }}
            />
          </Col>
          
          <Col md={6}>
            <h6 className="mb-1">{track.name}</h6>
            <p className="text-muted mb-1 small">{track.artists[0].name}</p>
            <p className="text-muted mb-0 small">{track.album.name}</p>
          </Col>
          
          <Col md={4} className="text-end">
            <div className="d-flex flex-column gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleCreateVinyl}
                disabled={loading}
              >
                Create Vinyl
              </Button>

               <Button
                variant={isFavorite ? "success" : "outline-secondary"}
                size="sm"
                onClick={handleAddToFavorites}
                disabled={loading || isFavorite}
              >
                {isFavorite ? '✓ Favorited' : 'Add to Favorites'}
              </Button>
            </div>
          </Col>
        </Row>

        {error && (
          <Alert variant="danger" className="mt-2 mb-0">
            Error: {error.message}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default TrackSelector;








