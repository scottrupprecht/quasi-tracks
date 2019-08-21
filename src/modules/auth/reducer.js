import { authActions } from './actions';

const initState = {
  accessToken: null,
};

export default (state = initState, action) => {
  switch (action.type) {
    case authActions.SET_ACCESS_TOKEN: {
      const { accessToken } = action.payload;

      return { ...state, accessToken: accessToken };
    }
    default: {
      return state;
    }
  }
};
