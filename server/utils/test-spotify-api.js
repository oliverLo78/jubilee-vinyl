const axios = require('axios');

const testSpotifyAPI = async () => {
  try {
    console.log('🧪 Testing Spotify API Integration...')

// Test your backend endpoint
const response = await axios.get('http://localhost:3001/api/spotify/search?q=queen&type=track&limit=5');
    
    console.log('✅ Backend API Response:', {
      status: response.status,
      data: response.data
    });
    
    return true;
  } catch (error) {
    console.error('❌ Backend API Test Failed:', {
      message: error.message,
      response: error.response?.data
    });
    return false;
  }
};

// Run the test
testSpotifyAPI();