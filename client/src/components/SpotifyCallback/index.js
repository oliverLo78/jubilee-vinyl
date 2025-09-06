// components/SpotifyCallback.js
import { useEffect } from 'react';
import { useSpotify } from '../utils/SpotifyContext';
import AuthService from '../utils/auth'

const SpotifyCallback = () => {
  const { setSpotifyToken } = useSpotify();
     useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('access_token');
      const error = urlParams.get('error');

    if (error) {
        console.error('Spotify auth error:', error);
        window.location.href = '/';
        return;
      }

    if (token) {
        AuthService.setSpotifyToken(token);
        setSpotifyToken(token);
        window.location.href = '/'; // Redirect to home after success
      }
    };

     handleCallback();
  }, [setSpotifyToken]);

return (
    <div className="container">
      <h2>Connecting to Spotify...</h2>
      <p>Please wait while we connect your Spotify account.</p>
    </div>
  );
};

export default SpotifyCallback;