import _ from 'lodash';
import toastr from 'toastr';

const toastrMiddleware = () => next => async action => {
  next(action);

  if (_.endsWith(action.type, 'Failure') && action.payload.message) {
    toastr.clear();
    toastr.error(action.payload.message, undefined, {
      timeOut: 30 * 1000,
      extendedTimeOut: 60 * 1000,
    });
  }
};

export default toastrMiddleware;
