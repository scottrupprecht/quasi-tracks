import _ from 'lodash';
import { spotifyActions } from '../spotify/actions';

const debouncedDoneProcessing = _.debounce(doneProcessing, 2500);

let isProcessing = false;

const isProcessingMiddleware = ({ dispatch }) => next => async action => {
  switch (action.type) {
    case spotifyActions.SELECT_ARTIST:
    case spotifyActions.LOAD_ARTIST_ALBUMS:
    case spotifyActions.LOAD_ALBUM:
    case spotifyActions.LOAD_ALBUM_TRACKS:
    case spotifyActions.LOADED_TRACK_AUDIO_FEATURES:
    case spotifyActions.SELECT_TRACKS: {
      if (!isProcessing) {
        isProcessing = true;
        dispatch({
          type: spotifyActions.START_PROCESSING,
        });
      }

      debouncedDoneProcessing(dispatch);
      break;
    }
    default: {
      break;
    }
  }

  next(action);
};

function doneProcessing (dispatch) {
  isProcessing = false;
  dispatch({
    type: spotifyActions.FINISHED_PROCESSING,
  });
}

export default isProcessingMiddleware;
