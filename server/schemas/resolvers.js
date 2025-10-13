const { User, VinylOrder } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Add Spotify API helper function
const fetchSpotifyData = async (query, type = 'track', limit = 20) => {
  try {
    // You'll need to get an access token first
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get Spotify access token');
    }

    // Search Spotify
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Spotify API responded with status: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Transform the response to match your Track type
    return searchData.tracks?.items.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      album: track.album.name,
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      imageUrl: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify
    })) || [];

  } catch (error) {
    console.error('Spotify API error:', error);
    throw new Error(`Spotify search failed: ${error.message}`);
  }
};

// Helper for searchTracks query (returns SpotifyTrack type)
const fetchSpotifyTracks = async (query) => {
  try {
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get Spotify access token');
    }

    // Search Spotify for tracks
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Spotify API responded with status: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // Transform the response to match your SpotifyTrack type
    return searchData.tracks?.items.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => ({
        id: artist.id,
        name: artist.name
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images.map(img => ({
          url: img.url,
          height: img.height,
          width: img.width
        }))
      },
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      imageUrl: track.album.images[0]?.url,
      spotifyUrl: track.external_urls.spotify
    })) || [];

  } catch (error) {
    console.error('Spotify tracks search error:', error);
    throw new Error(`Tracks search failed: ${error.message}`);
  }
};

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findById(context.user._id)
          .select("-__v -password")
          .populate("vinylOrders");
        
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },

    getUser: async (parent, { id }, context) => {
      if (context.user) {
        const user = await User.findById(id)
          .select("-__v -password")
          .populate("vinylOrders");
        
        return user;
      }
      throw new AuthenticationError("Not logged in");
    },

    searchSpotifyTracks: async (_, { query, type = 'track', limit = 20 }, context) => {
      try {
        console.log(`Searching Spotify for: "${query}"`);
        const response = await fetchSpotifyData(query, type, limit);
        console.log(`Found ${response.length} tracks`);
        return response;
      } catch (error) {
        console.error('Search error:', error);
        throw new Error(`Spotify search failed: ${error.message}`);
      }
    },

    searchTracks: async (_, { query }, context) => {
      try {
        console.log(`Searching tracks for: "${query}"`);
        const response = await fetchSpotifyTracks(query);
        console.log(`Found ${response.length} Spotify tracks`);
        return response;
      } catch (error) {
        console.error('Tracks search error:', error);
        throw new Error(`Tracks search failed: ${error.message}`);
      }
    },

    getOrders: async (parent, args, context) => {
      if (context.user) {
        const orders = await VinylOrder.find({ userId: context.user._id })
          .sort({ orderDate: -1 })
          .populate("user", "username email");
        
        return orders;
      }
      throw new AuthenticationError("Not logged in");
    },

    getOrder: async (parent, { id }, context) => {
      if (context.user) {
        const order = await VinylOrder.findById(id).populate("user", "username email");

        // Check if order belongs to user
        if (order.userId.toString() !== context.user._id.toString()) {
          throw new AuthenticationError("Not authorized to view this order");
        }
        
        return order;
      }
      throw new AuthenticationError("Not logged in");
    },

    getFavoriteTracks: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        return user.favoriteTracks;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect email");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password");
      }

      const token = signToken(user);
      return { token, user };
    },

    createOrder: async (parent, { orderData }, context) => {
      if (context.user) {
        const order = await VinylOrder.create({
          userId: context.user._id,
          ...orderData,
          status: 'pending',
          orderDate: new Date()
        });

        // Add order to user's vinylOrders array
        await User.findByIdAndUpdate(
          context.user._id,
          { $push: { vinylOrders: order._id } },
          { new: true }
        );

        // Populate user data before returning
        const populatedOrder = await VinylOrder.findById(order._id)
          .populate("user", "username email");
        
        return populatedOrder;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    updateOrder: async (parent, { id, status }, context) => {
      if (context.user) {
        const order = await VinylOrder.findById(id);
    
        // Check if order belongs to user
        if (order.userId.toString() !== context.user._id.toString()) {
          throw new AuthenticationError("Not authorized to update this order");
        }

        const updatedOrder = await VinylOrder.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        ).populate("user", "username email");
        
        return updatedOrder;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    deleteOrder: async (parent, { id }, context) => {
      if (context.user) {
        const order = await VinylOrder.findById(id);

        // Check if order belongs to user
        if (order.userId.toString() !== context.user._id.toString()) {
          throw new AuthenticationError("Not authorized to delete this order");
        }

        // Remove order from user's vinylOrders array
        await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { vinylOrders: id } }
        );

        // Delete the order
        await VinylOrder.findByIdAndDelete(id);
        
        return order;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    addFavoriteTrack: async (parent, { trackData }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { 
            $addToSet: { 
              favoriteTracks: trackData 
            } 
          },
          { new: true }
        ).select("-__v -password");
        
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    removeFavoriteTrack: async (parent, { trackId }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { 
            $pull: { 
              favoriteTracks: { trackId } 
            } 
          },
          { new: true }
        ).select("-__v -password");
        
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    updateProfile: async (parent, { email, username }, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          context.user._id,
          { email, username },
          { new: true, runValidators: true }
        ).select("-__v -password");
        
        return user;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  // Resolver for virtual fields
  VinylOrder: {
    orderSummary: (parent) => {
      return `${parent.trackName} by ${parent.artistName} on ${parent.vinylColor} ${parent.vinylSize} vinyl`;
    }
  }
};

module.exports = resolvers;