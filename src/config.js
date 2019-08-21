import _ from 'lodash';

export const isProduction = !_.includes(window.location.host, 'localhost');

export default {
  SpotifyClientId: '99f43a6aef114c17bf91c49dfb8469e5',
  CallbackUri: isProduction ? 'https://quacks.xyz' : 'http://localhost:3000',
  Scopes: ['user-read-playback-state', 'playlist-modify-private', 'user-modify-playback-state', 'playlist-read-private'].join(' '),
};
