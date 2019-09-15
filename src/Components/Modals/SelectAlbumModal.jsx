import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import Col from 'reactstrap/es/Col';
import { connect } from 'react-redux';
import AlbumSearchResultsTable from '../Tables/AlbumSearchResultsTable';

const SelectAlbumModal = props => {
  const { show, searchedAlbums, isLoadingAlbums } = props;

  return (
    <Modal isOpen={show} toggle={props.hide} className={props.className} size='lg'>
      <ModalHeader toggle={props.hide}>Search for an Album</ModalHeader>
      <ModalBody>
        <Row className='search-modal'>
          <Col md='12'>
            <AlbumSearchResultsTable albums={searchedAlbums} isLoading={isLoadingAlbums} onSelect={props.selectAlbum} />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

SelectAlbumModal.propTypes = {
  show: PropTypes.bool.isRequired,
  searchedAlbums: PropTypes.array.isRequired,
  isLoadingAlbums: PropTypes.bool.isRequired,
  className: PropTypes.string,
  selectAlbum: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

const mapStateToProps = ({ spotify, loading }) => {
  return {
    searchedAlbums: spotify.searchedAlbums,
    isLoadingAlbums: loading.isLoadingAlbums,
  };
};

export default connect(mapStateToProps)(SelectAlbumModal);
