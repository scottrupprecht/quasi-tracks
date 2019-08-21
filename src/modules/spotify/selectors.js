import _ from 'lodash';
import { createSelector } from 'reselect';
import { calculateEuclideanDistance } from '../../Helpers/scoreHelper';

const getTracks = (state) => state.spotify.tracks;
const getSelectedTracks = (state) => state.spotify.selectedTracks;
const getCurrentUserPlaylists = (state) => state.spotify.currentUserPlaylists;
const getAudioFeatures = (state) => state.spotify.audioFeatures;
const getParameters = (state) => state.spotify.parameters;

export const getActiveParameterKeys = createSelector([getParameters], (parameters) => {
  const keys = [];

  _.each(parameters, ({ active }, property) => {
    if (!active) {
      return;
    }

    return keys.push(property);
  });

  return keys;
});

export const getParameterValueDictionary = createSelector([getParameters], (parameters) => {
  const dictionary = {};

  _.each(parameters, ({ value }, property) => {
    dictionary[property] = value;
  });

  return dictionary;
});

export const getTrackResults = createSelector([getTracks, getAudioFeatures, getParameterValueDictionary, getActiveParameterKeys], (tracks, audioFeatures, parameterDictionary, activeParameterKeys) => {
  return _.map(tracks, (track) => {
    const currentTrackFeatures = _.get(audioFeatures, track.id, null);

    return {
      ...track,
      score: currentTrackFeatures ? calculateEuclideanDistance(currentTrackFeatures, parameterDictionary, activeParameterKeys) : null,
    };
  });
});

export const getCurrentUserPlaylistOptions = createSelector([getCurrentUserPlaylists], (currentUserPlaylists) => {
  return _.map(currentUserPlaylists, (playlist) => {
    return {
      ...playlist, label: playlist.name, value: playlist.id,
    };
  });
});

export const areSomeTracksSelected = createSelector([getTracks, getSelectedTracks], (tracks, selectedTracks) => {
  if (_.isEmpty(selectedTracks)) {
    return false;
  }

  return _.some(tracks, ({ id }) => _.has(selectedTracks, id));
});

export const areAllTracksSelected = createSelector([getTracks, getSelectedTracks], (tracks, selectedTracks) => {
  if (_.size(tracks) !== _.size(selectedTracks)) {
    return false;
  }

  return _.every(tracks, ({ id }) => _.has(selectedTracks, id));
});
