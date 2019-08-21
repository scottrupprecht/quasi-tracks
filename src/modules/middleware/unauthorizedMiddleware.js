import _ from 'lodash';
import { spotifyActions } from '../spotify/actions';

const unauthorizedMiddleware = () => next => action => {
  if (action.type === spotifyActions.UNAUTHORIZED || _.get(action.payload, 'statusCode') === 401) {
    window.location.href = window.location.origin;
    return;
  }

  return next(action);
};

export default unauthorizedMiddleware;
