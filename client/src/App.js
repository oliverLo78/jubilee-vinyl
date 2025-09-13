import React from 'react';
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
import VinylOrderForm from './pages/VinylOrder'; // Renamed for clarity
import OrderHistory from './pages/OrderHistory';
import VinylOrderDetail from './pages/VinylDetail'; // Renamed from SingleAlbum
import NotFound from './pages/NotFound';
import About from './pages/About';
import Profile from './pages/Profile';
import SearchSpotify from './pages/SearchSpotify'; // Added missing import
import CreateVinyl from './pages/CreateVinyl'; // Added missing import

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import SpotifyCallback from './components/SpotifyCallback';

// Utils
import { SpotifyProvider } from './utils/SpotifyContext';
import AuthService from './utils/auth'; // Added missing import

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' 
    ? '/graphql' 
    : 'http://localhost:3001/graphql',
});

// Construct request middleware that will attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = AuthService.getToken();
  const spotifyToken = AuthService.getSpotifyToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      ...(spotifyToken && { 'spotify-authorization': `Bearer ${spotifyToken}` }),
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
      <SpotifyProvider>
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
                <Route path="/create-vinyl" element={<CreateVinyl />} />
                <Route path="/create-vinyl/:trackId" element={<CreateVinyl />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/order/:orderId" element={<VinylOrderDetail />} />
                <Route path="/vinyl-order" element={<VinylOrderForm />} />
                <Route path="/about" element={<About />} />
                <Route path="/spotify-callback" element={<SpotifyCallback />} />
                <Route path="*" element={<NotFound />} />
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