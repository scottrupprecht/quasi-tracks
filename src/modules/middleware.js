import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import spotifyDataTriggerMiddleware from './middleware/spotifyDataTriggerMiddleware';
import isProcessingMiddleware from './middleware/isProcessingMiddleware';
import unauthorizedMiddleware from './middleware/unauthorizedMiddleware';
import toastrMiddleware from './middleware/toastrMiddleware';

export default applyMiddleware(unauthorizedMiddleware, isProcessingMiddleware, spotifyDataTriggerMiddleware, thunk, toastrMiddleware);
