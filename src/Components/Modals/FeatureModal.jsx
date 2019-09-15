import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import FeatureSidebar from '../../QuasiTracks/FeatureSidebar';

const FeatureModal = props => {
  const { show } = props;

  return (
    <Modal isOpen={show} toggle={props.hide} className={props.className}>
      <ModalHeader toggle={props.hide}>Features</ModalHeader>
      <ModalBody>
        <FeatureSidebar />
      </ModalBody>
    </Modal>
  );
};

FeatureModal.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  hide: PropTypes.func.isRequired,
};

export default React.memo(FeatureModal);
