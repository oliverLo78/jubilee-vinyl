import React, { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import Customizer from '../components/Customizer';

const TestCustomizer = () => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Sample track data for testing
  const sampleTrack = {
    id: 'test-track-1',
    name: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    image: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png'
  };

   return (
    <Container className="my-5">
      <h1>Vinyl Customizer Test Page</h1>
      
      {!showCustomizer ? (
        <div className="text-center">
          <Alert variant="info" className="mb-4">
            <h4>Testing Instructions:</h4>
            <ol className="text-start">
              <li>Click "Start Testing" to open customizer</li>
              <li>Upload different images to test</li>
              <li>Add text with different colors and fonts</li>
              <li>Try the "Add Track Info" button</li>
              <li>Test the save functionality</li>
            </ol>
          </Alert>
          
          <Button 
            variant="success" 
            size="lg"
            onClick={() => setShowCustomizer(true)}
          >
            🎵 Start Testing Customizer
          </Button>
        </div>
      ) : (
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowCustomizer(false)}
            className="mb-3"
          >
            ← Back to Test Menu
          </Button>
          <Customizer trackData={sampleTrack} />
        </div>
      )}
    </Container>
  );
};

export default TestCustomizer;