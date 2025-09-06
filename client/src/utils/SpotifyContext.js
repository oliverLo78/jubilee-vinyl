// utils/SpotifyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from './auth'; // Import your auth service

const SpotifyContext = createContext();

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState(AuthService.getSpotifyToken());
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync localStorage with state
  useEffect(() => {
    const token = AuthService.getSpotifyToken();
    if (token) {
      setSpotifyToken(token);
      checkPremiumStatus(token);
    }
  }, []);

  const checkPremiumStatus = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsPremium(data.product === 'premium');
      }
    } catch (error) {
      console.error('Error checking Spotify status:', error);
    }
  };

  const loginToSpotify = () => {
    // Redirect to your backend Spotify auth route
    window.location.href = 'http://localhost:3001/auth/spotify';
  };

  const setToken = (token) => {
    AuthService.setSpotifyToken(token);
    setSpotifyToken(token);
    checkPremiumStatus(token);
  };

  const disconnectSpotify = () => {
    localStorage.removeItem('spotify_token');
    setSpotifyToken(null);
    setIsPremium(false);
  };

   const value = {
    spotifyToken,
    setSpotifyToken,
    isPremium,
    setIsPremium,
    loginToSpotify
  };

    return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};