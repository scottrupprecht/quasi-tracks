import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import loadingReducer from './loading/reducer';
import spotifyReducer from './spotify/reducer';

export default combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  spotify: spotifyReducer,
});
