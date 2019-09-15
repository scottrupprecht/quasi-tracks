import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import Col from 'reactstrap/es/Col';
import { connect } from 'react-redux';
import ArtistsResultsTable from '../Tables/ArtistsResultsTable';

const SelectArtistModal = props => {
  const { show, artists, isLoadingArtists } = props;

  return (
    <Modal isOpen={show} toggle={props.hide} className={props.className} size='lg'>
      <ModalHeader toggle={props.hide}>Search for an Artist</ModalHeader>
      <ModalBody>
        <Row className='search-modal'>
          <Col md='12'>
            <ArtistsResultsTable artists={artists} onSelect={props.selectArtist} isLoading={isLoadingArtists} />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

SelectArtistModal.propTypes = {
  show: PropTypes.bool.isRequired,
  isLoadingArtists: PropTypes.bool.isRequired,
  artists: PropTypes.array.isRequired,
  className: PropTypes.string,
  selectArtist: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

const mapStateToProps = ({ spotify, loading }) => {
  return {
    artists: spotify.searchedArtists,
    isLoadingArtists: loading.isLoadingArtists,
  };
};

export default React.memo(connect(mapStateToProps)(SelectArtistModal));
