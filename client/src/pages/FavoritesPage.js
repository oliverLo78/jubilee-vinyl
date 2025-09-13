//a FavoritesPage.js 
{userFavorites.map(track => (
  <TrackSelector 
    key={track.trackId} 
    track={{
      id: track.trackId,
      name: track.trackName,
      artists: [{ name: track.artistName }],
      album: {
        name: track.albumName,
        images: [{ url: track.albumImage }]
      }
    }}
  />
))}