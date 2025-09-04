const express = require('express');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');

const path = require('path');
const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL Schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// For environment variables in development
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Security and performance middleware
const helmet = require('helmet');
const compression = require('compression');
app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
   // Enable introspection and playground only in development
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// MongoDB error handling
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => 
  {
    try{
  await server.start();
  // Apply  CORS setting if needed
  server.applyMiddleware({ 
       app,
      cors: {
        origin: process.env.CLIENT_URL || "http://127.0.0.1:3000",
        credentials: true
      }
   });
  
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
  };
  
  // Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
  
