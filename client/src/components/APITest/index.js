import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_SPOTIFY_TRACKS } from '../../utils/queries';
import { Button, Card, Alert, Pre } from './ApiTestStyles';

const APITest = () => {
  const [testQuery, setTestQuery] = useState('queen');
  const { loading, error, data, refetch } = useQuery(SEARCH_SPOTIFY_TRACKS, {
    variables: { query: testQuery, limit: 5 },
    skip: true, // Don't run automatically
  });

  const runTest = async () => {
    try {
      const result = await refetch({ query: testQuery, limit: 5 });
      console.log('API Response:', result);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

   return (
    <Card>
      <h3>API Test Component</h3>
      
      <input 
        value={testQuery}
        onChange={(e) => setTestQuery(e.target.value)}
        placeholder="Enter search term"
      />

      <Button onClick={runTest}>Test Search API</Button>

      {loading && <Alert>Loading...</Alert>}
      
      {error && (
        <Alert type="error">
          <strong>Error:</strong> {error.message}
        </Alert>
      )}

      {data && (
        <div>
          <Alert type="success">
            <strong>Success!</strong> API is working correctly.
          </Alert>
          <Pre>{JSON.stringify(data, null, 2)}</Pre>
        </div>
      )}
    </Card>
  );
};

export default APITest;