import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const CREATE_VINYL_ORDER = gql`
   mutation createVinylOrder($input: VinylOrderInput!) {
    createVinylOrder(input: $input) {
      _id
      trackName
      artistName
      vinylColor
      vinylSize
      status
      price
      orderDate
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      _id
      status
      trackName
      artistName
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation deleteOrder($orderId: ID!) {
    deleteOrder(orderId: $orderId) {
      _id
      trackName
    }
  }
`;

export const ADD_FAVORITE_TRACK = gql`
  mutation addFavoriteTrack($trackId: String!, $trackName: String!, $artistName: String!, $albumName: String, $albumImage: String) {
    addFavoriteTrack(trackId: $trackId, trackName: $trackName, artistName: $artistName, albumName: $albumName, albumImage: $albumImage) {
      _id
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

export const REMOVE_FAVORITE_TRACK = gql`
  mutation removeFavoriteTrack($trackId: String!) {
    removeFavoriteTrack(trackId: $trackId) {
      _id
      favoriteTracks {
        trackId
        trackName
        artistName
      }
    }
  }
`;

export const CONNECT_SPOTIFY = gql`
  mutation connectSpotify($code: String!) {
    connectSpotify(code: $code) {
      token
      user {
        _id
        username
        spotifyId
      }
    }
  }
`;

export const REFRESH_SPOTIFY_TOKEN = gql`
  mutation refreshSpotifyToken {
    refreshSpotifyToken {
      spotifyAccessToken
      spotifyTokenExpiry
    }
  }
`;
