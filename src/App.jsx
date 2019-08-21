import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { If } from 'react-if';
import { authActionCreators } from './modules/auth/actions';
import LoginContainer from './Containers/LoginContainer';
import LoadingUserContainer from './Containers/LoadingUserContainer';
import AppContainer from './Containers/AppContainer';
import { spotifyActionCreators } from './modules/spotify/actions';

class App extends React.PureComponent {
  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!prevProps.currentUserIsLoaded && this.props.currentUserIsLoaded) {
      this.props.getCurrentUsersPlaylists();
    }
  }

  render () {
    const { userIsLoggedIn, currentUserIsLoaded } = this.props;

    return (
      <div className='main-content' ref='mainContent'>
        <If condition={!userIsLoggedIn}>
          <LoginContainer />
        </If>
        <If condition={userIsLoggedIn && !currentUserIsLoaded}>
          <LoadingUserContainer />
        </If>
        <If condition={userIsLoggedIn && currentUserIsLoaded}>
          <AppContainer />
        </If>

      </div>
    );
  }

  componentDidMount () {
    const accessToken = App.getQueryVariable(window.location.hash.substring(1), 'access_token');

    if (accessToken) {
      this.props.setAccessToken(accessToken);
      this.props.getCurrentUser();
    }
  }

  static getQueryVariable (queryString, variable) {
    const vars = queryString.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }

    return null;
  }
}

const mapStateToProps = ({ auth, spotify }) => {
  return {
    userIsLoggedIn: !!auth.accessToken,
    currentUserIsLoaded: !!spotify.currentUser,
  };
};

const mapDispatchToProps = {
  setAccessToken: authActionCreators.setAccessToken,
  getCurrentUser: spotifyActionCreators.getCurrentUser,
  getCurrentUsersPlaylists: spotifyActionCreators.getCurrentUsersPlaylists,
};

App.propTypes = {
  userIsLoggedIn: PropTypes.bool.isRequired,
  currentUserIsLoaded: PropTypes.bool.isRequired,
  setAccessToken: PropTypes.func.isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  getCurrentUsersPlaylists: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
