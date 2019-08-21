import _ from 'lodash';
import PQueue from 'p-queue';
import SpotifyWebApi from 'spotify-web-api-js';
import { authActions } from '../auth/actions';
import { spotifyActions } from './actions';
import React from 'react';
import { sOrNoS } from '../../common';
import toastr from 'toastr';

const parameterDefaults = {
  min: 0,
  max: 1,
  step: 0.1,
};

const AudioFeatureDescriptions = {
  Acousticness: 'A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.',
  Danceability: 'Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.',
  Energy: 'Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.',
  Instrumentalness: 'Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
  Liveness: 'Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.',
  Speechiness: 'Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.',
  Valence: 'A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).',
};

const clearSearchState = {
  searchedArtists: [],
  searchedAlbums: [],
  selectedTracks: {},
  tracks: [],
  audioFeatures: {},
};

const initState = {
  spotifyApi: new SpotifyWebApi(),
  queue: new PQueue({ concurrency: 5, intervalCap: 10, interval: 800 }),
  isProcessing: false,
  searchedText: null,
  selectedPlaylist: null,
  currentUserPlaylists: [],
  searchedArtists: [],
  searchedAlbums: [],
  searchedPlaylists: [],
  tracks: [],
  selectedTracks: {},
  audioFeatures: {},
  parameters: {
    acousticness: { ...parameterDefaults, description: AudioFeatureDescriptions.Acousticness, property: 'acousticness', label: 'Acousticness', value: 0.5, active: true },
    danceability: { ...parameterDefaults, description: AudioFeatureDescriptions.Danceability, property: 'danceability', label: 'Danceability', value: 0.5, active: true },
    energy: { ...parameterDefaults, description: AudioFeatureDescriptions.Energy, property: 'energy', label: 'Energy', value: 0.5, active: true },
    instrumentalness: { ...parameterDefaults, description: AudioFeatureDescriptions.Instrumentalness, property: 'instrumentalness', label: 'Instrumentalness', value: 0.5, active: true },
    liveness: { ...parameterDefaults, description: AudioFeatureDescriptions.Liveness, property: 'liveness', label: 'Liveness', value: 0.5, active: true },
    speechiness: { ...parameterDefaults, description: AudioFeatureDescriptions.Speechiness, property: 'speechiness', label: 'Speechiness', value: 0.5, active: true },
    valence: { ...parameterDefaults, description: AudioFeatureDescriptions.Valence, property: 'valence', label: 'Valence', value: 0.5, active: true },
  },
  parametersAreDirty: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case authActions.SET_ACCESS_TOKEN: {
      const { accessToken } = action.payload;

      state.spotifyApi.setAccessToken(accessToken);

      return state;
    }
    case spotifyActions.GET_CURRENT_USER_SUCCESS: {
      const { currentUser } = action.payload;

      return { ...state, currentUser: currentUser };
    }
    case spotifyActions.TOGGLE_TRACK_SELECTED: {
      const { id } = action.payload;

      const selectedTracks = { ...state.selectedTracks };

      if (_.has(selectedTracks, id)) {
        delete selectedTracks[id];
      } else {
        selectedTracks[id] = id;
      }

      return { ...state, selectedTracks: selectedTracks };
    }
    case spotifyActions.GLOBAL_CHECKBOX_SELECTED: {
      const { shouldSelectAll } = action.payload;

      const selectedTracks = {};

      if (shouldSelectAll) {
        _.each(state.tracks, ({ id }) => {
          selectedTracks[id] = id;
        });
      }

      return { ...state, selectedTracks: selectedTracks };
    }
    case spotifyActions.SELECT_CURRENT_USER_PLAYLIST: {
      const { playlist } = action.payload;

      return {
        ...state,
        selectedPlaylist: playlist,
      };
    }
    case spotifyActions.CREATE_PLAYLIST_SUCCESS: {
      const { playlist } = action.payload;

      return {
        ...state,
        currentUserPlaylists: state.currentUserPlaylists.concat(transformPlaylist(playlist)),
        selectedPlaylist: transformPlaylist(playlist),
      };
    }
    case spotifyActions.GET_CURRENT_USERS_PLAYLISTS_SUCCESS: {
      const { playlists } = action.payload;

      return {
        ...state,
        currentUserPlaylists: _.map(_.sortBy(playlists, ({ name }) => _.toLower(name)), transformPlaylist),
      };
    }
    case spotifyActions.SEARCH_FOR_ARTISTS_SUCCESS: {
      const { artists } = action.payload;

      return {
        ...state,
        searchedArtists: _.map(artists, ({ followers, id, images, name, popularity }) => ({ followers, id, images, name, popularity })),
      };
    }
    case spotifyActions.SEARCH_FOR_ALBUMS_SUCCESS: {
      const { albums } = action.payload;

      return {
        ...state,
        searchedAlbums: _.map(albums, ({ id, artists, href, name, release_date: releaseDate, total_tracks: totalTracks }) => {
          return {
            id: id,
            artist: _.size(artists) > 0 ? artists[0] : null,
            href: href,
            name: name,
            releaseDate: releaseDate,
            totalTracks: totalTracks,
          };
        }),
      };
    }
    case spotifyActions.SEARCH_FOR_PUBLIC_PLAYLISTS_SUCCESS: {
      const { playlists } = action.payload;

      return {
        ...state,
        searchedPlaylists: _.map(playlists, ({ id, uri, href, name, owner, tracks }) => {
          return {
            id: id,
            uri: uri,
            owner: owner,
            href: href,
            name: name,
            totalTracks: tracks ? tracks.total : null,
          };
        }),
      };
    }
    case spotifyActions.SELECT_ARTIST: {
      const { artist } = action.payload;
      return {
        ...state,
        ...clearSearchState,
        searchedText: <span>Selected Artist: <strong>{artist.name}</strong></span>,
      };
    }
    case spotifyActions.SELECT_ALBUM: {
      const { album } = action.payload;
      return {
        ...state,
        ...clearSearchState,
        searchedText: <span>Selected Album: <strong>{album.name}</strong></span>,
      };
    }
    case spotifyActions.SELECT_PUBLIC_PLAYLIST: {
      const { playlist } = action.payload;
      return {
        ...state,
        ...clearSearchState,
        searchedText: <span>Selected Playlist: <strong>{playlist.name}</strong></span>,
      };
    }
    case spotifyActions.SELECT_TRACKS: {
      const { tracks } = action.payload;

      const dtos = _.map(tracks, ({ id, uri, name, artists, album, track_number: trackNumber }) => {
        return {
          id: id,
          name: name,
          uri: uri,
          artist: _.size(artists) > 0 ? artists[0].name : null,
          album: album ? album.name : null,
          trackNumber: trackNumber,
        };
      });

      return {
        ...state,
        tracks: state.tracks.concat(dtos),
      };
    }
    case spotifyActions.LOADED_TRACK_AUDIO_FEATURES: {
      const { audioFeatures } = action.payload;

      return {
        ...state,
        audioFeatures: {
          ...state.audioFeatures,
          ..._.keyBy(audioFeatures, 'id'),
        },
      };
    }
    case spotifyActions.TOGGLE_IS_ACTIVE: {
      const { id } = action.payload;

      return {
        ...state,
        parameters: {
          ...state.parameters,
          [id]: {
            ...state.parameters[id],
            active: !state.parameters[id].active,
          },
        },
        parametersAreDirty: true,
      };
    }
    case spotifyActions.SET_REFERENCE_VALUE: {
      const { id, value } = action.payload;

      return {
        ...state,
        parameters: {
          ...state.parameters,
          [id]: {
            ...state.parameters[id],
            value: value,
          },
        },
        parametersAreDirty: true,
      };
    }
    case spotifyActions.START_PROCESSING: {
      return { ...state, isProcessing: true };
    }
    case spotifyActions.FINISHED_PROCESSING: {
      return { ...state, isProcessing: false };
    }
    case spotifyActions.ADD_TRACKS_TO_PLAYLIST_SUCCESS: {
      const { playlistId, trackUris } = action.payload;

      const selectedPlaylist = _.find(state.currentUserPlaylists, { id: playlistId });

      toastr.success(`Successfully added ${_.size(trackUris)} track${sOrNoS(trackUris)} to ${selectedPlaylist ? `'${selectedPlaylist.name}'` : 'the selected playlist'}.`);

      return state;
    }
    default: {
      if (state.accessToken) {
        state.spotifyApi.setAccessToken(state.accessToken);
      }
      return state;
    }
  }
};

function transformPlaylist (playlist) {
  return {
    ...playlist,
    label: playlist.name,
    value: playlist.id,
  };
}
