import _ from 'lodash';
import { spotifyActions } from '../spotify/actions';

const ARTIST_ALBUMS_PAGE_SIZE = 50;
const ALBUM_TRACKS_PAGE_SIZE = 50;

const redirect = ({ dispatch, getState }) => next => async action => {
  next(action);

  switch (action.type) {
    case spotifyActions.SELECT_ARTIST: {
      const { artist } = action.payload;

      dispatch({
        type: spotifyActions.LOAD_ARTIST_ALBUMS,
        payload: {
          artist: artist,
          page: 0,
        },
      });

      return;
    }
    case spotifyActions.LOAD_ARTIST_ALBUMS: {
      const { artist, page } = action.payload;
      const { spotify } = getState();
      const { queue } = spotify;

      queue.add(() => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
          try {
            const result = await spotify.spotifyApi.getArtistAlbums(artist.id, { include_groups: 'album', limit: ARTIST_ALBUMS_PAGE_SIZE, offset: page * ARTIST_ALBUMS_PAGE_SIZE });
            const { items: albums, next } = result;

            if (next) {
              dispatch({
                type: spotifyActions.LOAD_ARTIST_ALBUMS,
                payload: {
                  artist: artist,
                  page: page + 1,
                },
              });
            }

            _.each(albums, (album) => {
              dispatch({
                type: spotifyActions.LOAD_ALBUM,
                payload: {
                  album: album,
                },
              });
            });

            return resolve(result);
          } catch (e) {
            dispatch({
              type: spotifyActions.UNAUTHORIZED,
            });
          }
        });
      });

      return;
    }
    case spotifyActions.SELECT_ALBUM:
    case spotifyActions.LOAD_ALBUM: {
      const { album } = action.payload;

      dispatch({
        type: spotifyActions.LOAD_ALBUM_TRACKS,
        payload: {
          album: album,
          page: 0,
        },
      });

      return;
    }
    case spotifyActions.LOAD_ALBUM_TRACKS: {
      const { album, page } = action.payload;
      const { spotify } = getState();
      const { queue } = spotify;

      queue.add(() => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
          try {
            const result = await spotify.spotifyApi.getAlbumTracks(album.id, { limit: ALBUM_TRACKS_PAGE_SIZE, offset: page * ALBUM_TRACKS_PAGE_SIZE });
            const { items, next } = result;

            const tracks = _.map(items, (track) => ({ ...track, album }));

            if (next) {
              dispatch({
                type: spotifyActions.LOAD_ALBUM_TRACKS,
                payload: {
                  album: album,
                  page: page + 1,
                },
              });
            }

            dispatch({
              type: spotifyActions.SELECT_TRACKS,
              payload: {
                tracks: tracks,
              },
            });

            return resolve(result);
          } catch (e) {
            dispatch({
              type: spotifyActions.UNAUTHORIZED,
            });
          }
        });
      });

      return;
    }
    case spotifyActions.SELECT_TRACKS: {
      const { tracks } = action.payload;
      const { spotify } = getState();
      const { queue } = spotify;

      queue.add(() => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
          try {
            const { audio_features: audioFeatures } = await spotify.spotifyApi.getAudioFeaturesForTracks(_.map(tracks, 'id'));

            dispatch({
              type: spotifyActions.LOADED_TRACK_AUDIO_FEATURES,
              payload: {
                audioFeatures: audioFeatures,
              },
            });

            return resolve(audioFeatures);
          } catch (e) {
            dispatch({
              type: spotifyActions.UNAUTHORIZED,
            });
          }
        });
      });

      return;
    }
    case spotifyActions.SELECT_PUBLIC_PLAYLIST: {
      const { playlist } = action.payload;

      dispatch({
        type: spotifyActions.LOAD_PLAYLIST_TRACKS,
        payload: {
          playlist: playlist,
          page: 0,
        },
      });

      return;
    }
    case spotifyActions.LOAD_PLAYLIST_TRACKS: {
      const { playlist, page } = action.payload;
      const { spotify } = getState();
      const { queue } = spotify;

      queue.add(() => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const result = await spotify.spotifyApi.getPlaylistTracks(playlist.id, { limit: ALBUM_TRACKS_PAGE_SIZE, offset: page * ALBUM_TRACKS_PAGE_SIZE });
            const { items, next } = result;

            const tracks = _.map(items, (item) => ({ ...item.track, playlist }));

            if (next) {
              dispatch({
                type: spotifyActions.LOAD_PLAYLIST_TRACKS,
                payload: {
                  playlist: playlist,
                  page: page + 1,
                },
              });
            }

            dispatch({
              type: spotifyActions.SELECT_TRACKS,
              payload: {
                tracks: tracks,
              },
            });

            return resolve(result);
          } catch (e) {
            dispatch({
              type: spotifyActions.UNAUTHORIZED,
            });
          }
        });
      });

      break;
    }
    default: {
      // eslint-disable-next-line no-useless-return
      return;
    }
  }
};

export default redirect;
