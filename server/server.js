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

// Serve static assets - ALWAYS serve static files, not just in production
const buildPath = path.join(__dirname, '../client/build');
console.log('Looking for build directory at:', buildPath);
const hasBuild = fs.existsSync(buildPath);

if (hasBuild) {
  console.log('✅ Build directory found, serving static files...');

  // Serve static files from React build
  app.use(express.static(buildPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Ensure proper MIME types
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));
} else {
  console.log('❌ Build directory not found at:', buildPath);
  console.log('⚠️  Running in API-only mode (no frontend served)');

  // Basic route for root when no build directory exists
  app.get('/', (req, res) => {
    res.json({
      message: 'API Server is running',
      graphql: `http://localhost:${PORT}/graphql`,
      note: 'React app not built - run "cd client && npm run build"'
    });
  });
}

// Use routes
app.use(routes);

// Test route to verify Express is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Express server is working!', timestamp: new Date() });
});

app.get('/api/graphql-test', (req, res) => {
  res.json({ message: 'GraphQL endpoint is available at /graphql' });
});

if (hasBuild) {
  // Serve index.html for all other routes (SPA support)
  app.get('*', (req, res) => {
    // Don't serve HTML for static asset requests
    if (req.path.startsWith('/static/') ||
        req.path.endsWith('.css') ||
        req.path.endsWith('.js') ||
        req.path.endsWith('.json') ||
        req.path.endsWith('.ico')) {
      // Let express.static handle these
      return res.status(404).send('Static file not found');
    }
    
    // Serve React app
    res.sendFile(path.join(buildPath, 'index.html'));
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

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);

