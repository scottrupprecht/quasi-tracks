export const authActions = {
  SET_ACCESS_TOKEN: 'quasiTracks/auth/setAccessToken',
};

export const setAccessToken = (accessToken) => ({
  type: authActions.SET_ACCESS_TOKEN,
  payload: {
    accessToken: accessToken,
  },
});

export const authActionCreators = {
  setAccessToken: setAccessToken,
};
