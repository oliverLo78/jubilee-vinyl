import React from 'react';
// import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { VinylOrder } from './pages/VinylOrder';
import OrderHistory from './pages/OrderHistory';
import VinylDetail from './pages/VinylDetail'; // Renamed from SingleAlbum
import NotFound from './pages/NotFound';
import About from './pages/About';
import Profile from './pages/Profile'; // New profile page

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import { SpotifyProvider } from './utils/SpotifyContext'; // For Spotify integration
import SpotifyCallback from './components/SpotifyCallback';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? '/graphql' 
    : 'http://localhost:3001/graphql',
});

// Construct request middleware that will attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = AuthService.getToken();
  const spotifyToken = AuthService.getSpotifyToken(); // For Spotify API calls

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      ...(spotifyToken && { 'spotify-authorization': `Bearer ${spotifyToken}`}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <SpotifyProvider> {/* Wrap with Spotify context */}
        <Router>
          <div className="flex-column justify-flex-start min-100-vh">
            <Header />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchSpotify />} />
                <Route path="/create-vinyl/:trackId" element={<CreateVinyl />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/order/:orderId" element={<VinylDetail />} />
                <Route path="/create-vinyl/:trackId?" element={<VinylOrder />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/spotify-callback" element={<SpotifyCallback />}/>
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </SpotifyProvider>
    </ApolloProvider>
  );
}

export default App;

