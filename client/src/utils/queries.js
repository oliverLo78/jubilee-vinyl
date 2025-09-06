import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      vinylOrders {
        _id
        trackName
        artistName
        vinylColor
        status
        orderDate
        price
      }
      favoriteTracks {
        trackId
        trackName
        artistName
        albumName
        albumImage
      }
    }
  }
`;

export const QUERY_ORDERS = gql`
  query getOrders {
    orders {
      _id
      trackName
      artistName
      vinylColor
      vinylSize
      status
      price
      orderDate
      user {
        username
        email
      }
    }
  }
`;

export const QUERY_SINGLE_ORDER = gql`
  query getSingleOrder($orderId: ID!) {
    order(orderId: $orderId) {
      _id
      trackName
      artistName
      albumName
      albumImage
      previewUrl
      vinylColor
      vinylSize
      status
      price
      orderDate
      estimatedDelivery
      shippingAddress {
        street
        city
        state
        zipCode
        country
      }
      user {
        _id
        username
        email
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      spotifyId
      vinylOrders {
        _id
        trackName
        artistName
        albumImage
        vinylColor
        vinylSize
        status
        price
        orderDate
      }
      favoriteTracks {
        trackId
        trackName
        artistName
        albumName
        albumImage
      }
    }
  }
`;

export const QUERY_SPOTIFY_PROFILE = gql`
  query spotifyProfile {
    spotifyProfile {
      id
      display_name
      email
      product # This tells us if user has Spotify Premium
      images {
        url
      }
    }
  }
`;

export const SEARCH_SPOTIFY_TRACKS = gql`
  query searchSpotifyTracks($query: String!, $type: String = "track", $limit: Int = 20) {
    searchSpotifyTracks(query: $query, type: $type, limit: $limit) {
      tracks {
        items {
          id
          name
          artists {
            name
          }
          album {
            name
            images {
              url
            }
          }
          duration_ms
          preview_url
        }
      }
    }
  }
`;

export const QUERY_USER_PLAYLISTS = gql`
  query getUserPlaylists {
    getUserPlaylists {
      items {
        id
        name
        description
        images {
          url
        }
        tracks {
          total
        }
      }
    }
  }
`;

