const express = require('express');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');

const path = require('path');
const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL Schema
const { typeDefs, resolvers } = require('./schemas');
const { connectDB } = require('./config/connection');

// For environment variables in development
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Security and performance middleware
const helmet = require('helmet');
const compression = require('compression');
app.use(helmet());
app.use(compression());

// Integration for server to use routes
const routes = require('./routes');
app.use(routes);

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

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/service-worker.js'));
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/manifest.json'));
});

// MongoDB error handling
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => 
  {
    try{
      // Connect to database first
       await connectDB();
    
    await server.start();
    server.applyMiddleware({ app });
    
    app.listen(PORT, () => {
      console.log(`🚀 API server running on port ${PORT}!`);
      console.log(`🔮 GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
};
   
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
  
