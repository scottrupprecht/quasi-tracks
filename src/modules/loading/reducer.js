import { spotifyActions } from '../spotify/actions';

const initState = {
  isLoadingArtists: false,
  isLoadingAlbums: false,
  isLoadingPublicPlaylists: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case spotifyActions.SEARCH_FOR_ARTISTS_REQUEST: {
      return { ...state, isLoadingArtists: true };
    }
    case spotifyActions.SEARCH_FOR_ARTISTS_FAILURE:
    case spotifyActions.SEARCH_FOR_ARTISTS_SUCCESS: {
      return { ...state, isLoadingArtists: false };
    }

    case spotifyActions.SEARCH_FOR_ALBUMS_REQUEST: {
      return { ...state, isLoadingAlbums: true };
    }
    case spotifyActions.SEARCH_FOR_ALBUMS_FAILURE:
    case spotifyActions.SEARCH_FOR_ALBUMS_SUCCESS: {
      return { ...state, isLoadingAlbums: false };
    }

    case spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_REQUEST: {
      return { ...state, isLoadingPublicPlaylists: true };
    }
    case spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_SUCCESS:
    case spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_FAILURE: {
      return { ...state, isLoadingPublicPlaylists: false };
    }
    default: {
      return state;
    }
  }
};
