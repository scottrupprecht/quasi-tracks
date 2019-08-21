import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const LoadingUserContainer = () => (
  <Container fluid>
    <Row>
      <Col xl='12'>
        <h1 className='text-center'><i className='fa fa-spin fa-refresh' /> Loading Current User</h1>
      </Col>
    </Row>
  </Container>
);

LoadingUserContainer.propTypes = {

};

export default LoadingUserContainer;
