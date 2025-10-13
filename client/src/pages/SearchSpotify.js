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

  

