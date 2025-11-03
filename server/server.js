const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const { connectDB } = require('./config/connection');
const routes = require('./routes');

require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Fix MongoDB deprecation warning
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Security middleware
app.use(require('helmet')({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(require('compression')());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use routes
app.use(routes);

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Express server is working!', timestamp: new Date() });
});

// SERVE STATIC FILES - SIMPLIFIED AND CORRECT
const buildPath = path.join(__dirname, '../client/build');

if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found:', buildPath);
  
  // CRITICAL FIX: Serve static files from the build directory
  // This will handle /static/css/main.42249450.css automatically
  app.use(express.static(buildPath));
  
  // Debug middleware to log static file requests
  app.use('/static', (req, res, next) => {
    console.log('Static file request:', req.path);
    const filePath = path.join(buildPath, 'static', req.path);
    console.log('Looking for file at:', filePath);
    console.log('File exists:', fs.existsSync(filePath));
    next();
  });

  // Serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't handle API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/graphql')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    
    // Serve React app
    res.sendFile(path.join(buildPath, 'index.html'));
  });
  
} else {
  console.log('❌ Build directory not found');
  app.get('/', (req, res) => {
    res.json({ message: 'API Server - Run "cd client && npm run build"' });
  });
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true,
  playground: true,
});

// Start server
const startApolloServer = async () => {
  try {
    await connectDB();
    await server.start();
    
    server.applyMiddleware({ 
      app,
      path: '/graphql',
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true
      }
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🌍 React App: http://localhost:${PORT}`);
      console.log(`🎯 Testing CSS: http://localhost:${PORT}/static/css/main.42249450.css`);
    });
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
};

startApolloServer();