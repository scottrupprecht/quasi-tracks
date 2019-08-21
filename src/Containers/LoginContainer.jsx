import React from 'react';
import Config from '../config';
import { Col, Container, Row } from 'reactstrap';

class LoginContainer extends React.PureComponent {
  render () {
    return (
      <Container fluid>
        <Row>
          <Col xl='12'>
            <div className='login-container'>
              <button className='btn btn-primary btn-lg' onClick={this.redirectToLogin}>Log in to Spotify</button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  redirectToLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${Config.SpotifyClientId}&redirect_uri=${encodeURI(Config.CallbackUri)}&response_type=token&scope=${Config.Scopes}`;
  };
}

LoginContainer.propTypes = {

};

export default LoginContainer;
