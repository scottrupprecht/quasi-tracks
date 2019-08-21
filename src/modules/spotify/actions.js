import _ from 'lodash';
import { areAllTracksSelected } from './selectors';
const CURRENT_USER_PLAYLISTS_PAGE_SIZE = 50;

export const spotifyActions = {
  UNAUTHORIZED: 'quasiTracks/spotify/unauthorized',
  GLOBAL_CHECKBOX_SELECTED: 'quasiTracks/spotify/globalCheckboxSelected',
  SELECT_ARTIST: 'quasiTracks/spotify/selectArtist',
  SELECT_ALBUM: 'quasiTracks/spotify/selectAlbum',
  SELECT_PUBLIC_PLAYLIST: 'quasiTracks/spotify/selectPublicPlaylist',
  TOGGLE_TRACK_SELECTED: 'quasiTracks/spotify/toggleTrackSelected',
  TOGGLE_IS_ACTIVE: 'quasiTracks/spotify/toggleIsActive',
  SET_REFERENCE_VALUE: 'quasiTracks/spotify/setReferenceValue',
  SELECT_CURRENT_USER_PLAYLIST: 'quasiTracks/spotify/selectCurrentUserPlaylist',
  LOADED_ARTIST_ALBUMS: 'quasiTracks/spotify/loadedArtistAlbums',
  RESET_FEATURES_TO_REFERENCE_SONG: 'quasiTracks/spotify/resetFeaturesToReferenceSong',
  START_PROCESSING: 'quasiTracks/spotify/startProcessing',
  FINISHED_PROCESSING: 'quasiTracks/spotify/finishedProcessing',
  LOAD_ALBUM_TRACKS: 'quasiTracks/spotify/loadAlbumTracks',
  LOAD_PLAYLIST_TRACKS: 'quasiTracks/spotify/loadPlaylistTracks',
  LOADED_TRACK_AUDIO_FEATURES: 'quasiTracks/spotify/loadedTrackAudioFeatures',

  LOAD_ARTIST_ALBUMS: 'quasiTracks/spotify/loadArtistAlbums',
  LOAD_TRACK_AUDIO_FEATURES: 'quasiTracks/spotify/loadAudioTrackFeatures',
  LOAD_ALBUM: 'quasiTracks/spotify/loadAlbum',
  SELECT_TRACKS: 'quasiTracks/spotify/selectTracks',

  GET_CURRENT_USER_REQUEST: 'quasiTracks/spotify/getCurrentUserRequest',
  GET_CURRENT_USER_SUCCESS: 'quasiTracks/spotify/getCurrentUserSuccess',
  GET_CURRENT_USER_FAILURE: 'quasiTracks/spotify/getCurrentUserFailure',

  GET_CURRENT_USERS_PLAYLISTS_REQUEST: 'quasiTracks/spotify/getCurrentUsersPlaylistsRequest',
  GET_CURRENT_USERS_PLAYLISTS_SUCCESS: 'quasiTracks/spotify/getCurrentUsersPlaylistsSuccess',
  GET_CURRENT_USERS_PLAYLISTS_FAILURE: 'quasiTracks/spotify/getCurrentUsersPlaylistsFailure',

  SEARCH_FOR_TRACKS_REQUEST: 'quasiTracks/spotify/searchForTracksRequest',
  SEARCH_FOR_TRACKS_SUCCESS: 'quasiTracks/spotify/searchForTracksSuccess',
  SEARCH_FOR_TRACKS_FAILURE: 'quasiTracks/spotify/searchForTracksFailure',

  SEARCH_FOR_ARTISTS_REQUEST: 'quasiTracks/spotify/searchForArtistsRequest',
  SEARCH_FOR_ARTISTS_SUCCESS: 'quasiTracks/spotify/searchForArtistsSuccess',
  SEARCH_FOR_ARTISTS_FAILURE: 'quasiTracks/spotify/searchForArtistsFailure',

  SEARCH_FOR_ALBUMS_REQUEST: 'quasiTracks/spotify/searchForAlbumsRequest',
  SEARCH_FOR_ALBUMS_SUCCESS: 'quasiTracks/spotify/searchForAlbumsSuccess',
  SEARCH_FOR_ALBUMS_FAILURE: 'quasiTracks/spotify/searchForAlbumsFailure',

  SEARCH_FOR_PUBLIC_PLAYLISTS_REQUEST: 'quasiTracks/spotify/searchForPublicPlaylistsRequest',
  SEARCH_FOR_PUBLIC_PLAYLISTS_SUCCESS: 'quasiTracks/spotify/searchForPublicPlaylistsSuccess',
  SEARCH_FOR_PUBLIC_PLAYLISTS_FAILURE: 'quasiTracks/spotify/searchForPublicPlaylistsFailure',

  START_PLAYING_TRACK_REQUEST: 'quasiTracks/spotify/startPlayingTrackRequest',
  START_PLAYING_TRACK_SUCCESS: 'quasiTracks/spotify/startPlayingTrackSuccess',
  START_PLAYING_TRACK_FAILURE: 'quasiTracks/spotify/startPlayingTrackFailure',

  CREATE_PLAYLIST_REQUEST: 'quasiTracks/spotify/createPlaylistRequest',
  CREATE_PLAYLIST_SUCCESS: 'quasiTracks/spotify/createPlaylistSuccess',
  CREATE_PLAYLIST_FAILURE: 'quasiTracks/spotify/createPlaylistFailure',

  ADD_TRACKS_TO_PLAYLIST_REQUEST: 'quasiTracks/spotify/addTracksToPlaylistRequest',
  ADD_TRACKS_TO_PLAYLIST_SUCCESS: 'quasiTracks/spotify/addTracksToPlaylistSuccess',
  ADD_TRACKS_TO_PLAYLIST_FAILURE: 'quasiTracks/spotify/addTracksToPlaylistFailure',
};

export const startProcessing = (artistId, parameters) => ({
  type: spotifyActions.START_PROCESSING,
  payload: {
    artistId: artistId,
    parameters: parameters,
  },
});

export const finishedProcessing = () => ({
  type: spotifyActions.FINISHED_PROCESSING,
});

export const toggleIsActive = (id) => ({
  type: spotifyActions.TOGGLE_IS_ACTIVE,
  payload: {
    id: id,
  },
});

export const toggleTrackSelected = (id) => ({
  type: spotifyActions.TOGGLE_TRACK_SELECTED,
  payload: {
    id: id,
  },
});

export const globalCheckboxSelected = () => (dispatch, getState) => {
  const state = getState();
  const allRowsAreSelected = areAllTracksSelected(state);

  dispatch({
    type: spotifyActions.GLOBAL_CHECKBOX_SELECTED,
    payload: {
      shouldSelectAll: !allRowsAreSelected,
    },
  });
};
export const setReferenceValue = (id, value) => ({
  type: spotifyActions.SET_REFERENCE_VALUE,
  payload: {
    id: id,
    value: value,
  },
});

export const selectArtist = (artist) => ({
  type: spotifyActions.SELECT_ARTIST,
  payload: {
    artist: artist,
  },
});

export const selectAlbum = (album) => ({
  type: spotifyActions.SELECT_ALBUM,
  payload: {
    album: album,
  },
});

export const selectPublicPlaylist = (playlist) => ({
  type: spotifyActions.SELECT_PUBLIC_PLAYLIST,
  payload: {
    playlist: playlist,
  },
});

export const selectCurrentUserPlaylist = (playlist) => ({
  type: spotifyActions.SELECT_CURRENT_USER_PLAYLIST,
  payload: {
    playlist: playlist,
  },
});

export const resetFeaturesToReferenceSong = (artist) => ({
  type: spotifyActions.RESET_FEATURES_TO_REFERENCE_SONG,
});

export const getCurrentUser = () => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.GET_CURRENT_USER_REQUEST,
    });

    const currentUser = await spotifyApi.getMe();

    dispatch({
      type: spotifyActions.GET_CURRENT_USER_SUCCESS,
      payload: {
        currentUser: currentUser,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.GET_CURRENT_USER_FAILURE,
      payload: {
        statusCode: e.status,
      },
    });
  }
};

export const getCurrentUsersPlaylists = () => async (dispatch, getState) => {
  const { spotify: { spotifyApi, currentUser } } = getState();

  try {
    dispatch({
      type: spotifyActions.GET_CURRENT_USERS_PLAYLISTS_REQUEST,
    });

    const playlists = await getAllCurrentUsersPlaylists(spotifyApi, [], 0);

    const playlistsOwnedByCurrentUser = _.filter(playlists, ['owner.id', currentUser.id]);

    dispatch({
      type: spotifyActions.GET_CURRENT_USERS_PLAYLISTS_SUCCESS,
      payload: {
        playlists: playlistsOwnedByCurrentUser,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.GET_CURRENT_USERS_PLAYLISTS_FAILURE,
      payload: {
        statusCode: e.status,
      },
    });
  }
};

export const searchForTracks = (query, pagination = { limit: 10, offset: 0 }) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.SEARCH_FOR_TRACKS_REQUEST,
    });

    const { tracks: { items: tracks } } = await spotifyApi.searchTracks(query, pagination);

    dispatch({
      type: spotifyActions.SEARCH_FOR_TRACKS_SUCCESS,
      payload: {
        tracks: tracks,
        query: query,
        pagination: pagination,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.SEARCH_FOR_TRACKS_FAILURE,
      payload: {
        statusCode: e.status,
      },
    });
  }
};

export const searchForArtists = (query, pagination = { limit: 50, offset: 0 }) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.SEARCH_FOR_ARTISTS_REQUEST,
    });

    const { artists: { items: artists } } = await spotifyApi.searchArtists(query, pagination);

    dispatch({
      type: spotifyActions.SEARCH_FOR_ARTISTS_SUCCESS,
      payload: {
        artists: artists,
        query: query,
        pagination: pagination,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.SEARCH_FOR_ARTISTS_FAILURE,
      payload: {
        statusCode: e.status,
      },
    });
  }
};

export const searchForAlbums = (query, pagination = { limit: 50, offset: 0 }) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.SEARCH_FOR_ALBUMS_REQUEST,
    });

    const { albums: { items: albums } } = await spotifyApi.searchAlbums(query, pagination);

    dispatch({
      type: spotifyActions.SEARCH_FOR_ALBUMS_SUCCESS,
      payload: {
        albums: albums,
        query: query,
        pagination: pagination,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.SEARCH_FOR_ALBUMS_FAILURE,
      payload: {
        e: e,
        statusCode: e.status,
      },
    });
  }
};

export const searchForPublicPlaylists = (query, pagination = { limit: 50, offset: 0 }) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_REQUEST,
    });

    const { playlists: { items: playlists } } = await spotifyApi.searchPlaylists(query, pagination);

    dispatch({
      type: spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_SUCCESS,
      payload: {
        playlists: playlists,
        query: query,
        pagination: pagination,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_FAILURE,
      payload: {
        e: e,
        statusCode: e.status,
      },
    });
  }
};

export const startPlayingTrack = (uri) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  const currentState = await spotifyApi.getMyCurrentPlaybackState();

  if (!currentState) {
    dispatch({
      type: spotifyActions.START_PLAYING_TRACK_FAILURE,
      payload: {
        message: 'No track is currently playing. This feature only works when there is a track currently playing on Spotify.',
      },
    });

    return;
  }

  try {
    dispatch({
      type: spotifyActions.START_PLAYING_TRACK_REQUEST,
    });

    const result = await spotifyApi.play({ uris: [uri] });

    console.log({ result });

    dispatch({
      type: spotifyActions.START_PLAYING_TRACK_SUCCESS,
      payload: {
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.START_PLAYING_TRACK_FAILURE,
      payload: {
        e: e,
        statusCode: e.status,
      },
    });
  }
};

export const createNewPlaylist = (name) => async (dispatch, getState) => {
  const { spotify: { spotifyApi, currentUser } } = getState();

  if (!window.confirm(`Are you sure you want to create a new playlist titled: "${name}"?`)) { return; }

  try {
    dispatch({
      type: spotifyActions.CREATE_PLAYLIST_REQUEST,
    });

    const createdPlaylist = await spotifyApi.createPlaylist(currentUser.id, { name: name, public: false });

    dispatch({
      type: spotifyActions.CREATE_PLAYLIST_SUCCESS,
      payload: {
        playlist: createdPlaylist,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.CREATE_PLAYLIST_FAILURE,
      payload: {
        e: e,
        statusCode: e.status,
      },
    });
  }
};

export const addTracksToPlaylist = (playlistId, trackUris) => async (dispatch, getState) => {
  const { spotify: { spotifyApi } } = getState();

  try {
    dispatch({
      type: spotifyActions.ADD_TRACKS_TO_PLAYLIST_REQUEST,
    });

    await spotifyApi.addTracksToPlaylist(playlistId, trackUris);

    dispatch({
      type: spotifyActions.ADD_TRACKS_TO_PLAYLIST_SUCCESS,
      payload: {
        playlistId: playlistId,
        trackUris: trackUris,
      },
    });
  } catch (e) {
    dispatch({
      type: spotifyActions.ADD_TRACKS_TO_PLAYLIST_FAILURE,
      payload: {
        e: e,
        statusCode: e.status,
      },
    });
  }
};

async function getAllCurrentUsersPlaylists (spotifyApi, allPlaylists, page) {
  const { items: playlists, next } = await spotifyApi.getUserPlaylists({ limit: CURRENT_USER_PLAYLISTS_PAGE_SIZE, offset: page * CURRENT_USER_PLAYLISTS_PAGE_SIZE });

  _.each(playlists, (playlist) => allPlaylists.push(playlist));

  if (next) {
    await getAllCurrentUsersPlaylists(spotifyApi, allPlaylists, page + 1);
  }

  return allPlaylists;
}

export const spotifyActionCreators = {
  toggleIsActive: toggleIsActive,
  toggleTrackSelected: toggleTrackSelected,
  globalCheckboxSelected: globalCheckboxSelected,
  setReferenceValue: setReferenceValue,
  resetFeaturesToReferenceSong: resetFeaturesToReferenceSong,
  startProcessing: startProcessing,
  finishedProcessing: finishedProcessing,
  selectArtist: selectArtist,
  selectAlbum: selectAlbum,
  selectPublicPlaylist: selectPublicPlaylist,
  selectCurrentUserPlaylist: selectCurrentUserPlaylist,
  getCurrentUser: getCurrentUser,
  getCurrentUsersPlaylists: getCurrentUsersPlaylists,
  searchForAlbums: searchForAlbums,
  searchForTracks: searchForTracks,
  searchForArtists: searchForArtists,
  searchForPublicPlaylists: searchForPublicPlaylists,
  startPlayingTrack: startPlayingTrack,
  createNewPlaylist: createNewPlaylist,
  addTracksToPlaylist: addTracksToPlaylist,
};
