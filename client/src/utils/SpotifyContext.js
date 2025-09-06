// utils/SpotifyContext.js
import React, { createContext, useContext, useState } from 'react';

const SpotifyContext = createContext();

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

export const SpotifyProvider = ({ children }) => {
  const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotify_token'));
  const [isPremium, setIsPremium] = useState(false);

  const loginToSpotify = () => {
    // Redirect to your backend Spotify auth route
    window.location.href = 'http://localhost:3001/auth/spotify';
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