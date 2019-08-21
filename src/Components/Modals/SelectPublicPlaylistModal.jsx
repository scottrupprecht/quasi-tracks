import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import Col from 'reactstrap/es/Col';
import { connect } from 'react-redux';
import PublicPlaylistSearchResultsTable from '../Tables/PublicPlaylistSearchResultsTable';

const SelectPublicPlaylistModal = props => {
  const { show, searchedPlaylists, isLoadingPublicPlaylists } = props;

  return (
    <Modal isOpen={show} toggle={props.hide} className={props.className} size='lg'>
      <ModalHeader toggle={props.hide}>Search for a Public Playlist</ModalHeader>
      <ModalBody>
        <Row style={{
          marginTop: 7,
          overflowX: 'auto',
        }}
        >
          <Col md='12'>
            <PublicPlaylistSearchResultsTable
              playlists={searchedPlaylists}
              isLoading={isLoadingPublicPlaylists}
              onSelect={props.selectPublicPlaylist}
            />
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

SelectPublicPlaylistModal.propTypes = {
  show: PropTypes.bool.isRequired,
  searchedPlaylists: PropTypes.array.isRequired,
  isLoadingPublicPlaylists: PropTypes.bool.isRequired,
  className: PropTypes.string,
  selectPublicPlaylist: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
};

const mapStateToProps = ({ spotify, loading }) => {
  return {
    searchedPlaylists: spotify.searchedPlaylists,
    isLoadingPublicPlaylists: loading.isLoadingPublicPlaylists,
  };
};

export default React.memo(connect(mapStateToProps)(SelectPublicPlaylistModal));
