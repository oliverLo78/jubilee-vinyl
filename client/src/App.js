import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SearchSpotify from './pages/SearchSpotify';
import CustomizerPage from './pages/CustomizerPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import SpotifyCallback from './components/SpotifyCallback';


// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Customizer from './components/Customizer';

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
        {/* Everything inside the Router can now use React Router hooks */}
        <Header />
        <div className="flex-column justify-flex-start min-100-vh">
          <div className="container flex-grow 1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<SearchSpotify />} />
              <Route path="/customize" element={<CustomizerPage />} />
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