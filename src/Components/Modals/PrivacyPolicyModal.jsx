import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const PrivacyPolicyModal = props => {
  const { show } = props;

  return (
    <Modal isOpen={show} toggle={props.hide}>
      <ModalHeader toggle={props.hide}>Privacy Policy</ModalHeader>
      <ModalBody className='text-center'>
        <h3><strong>Privacy Notice</strong></h3>
        <p>This privacy notice discloses the privacy practices for (quacks.xyz). This privacy notice applies solely to information collected by this website.</p>

        <h4><strong>Information Collection, Use, and Sharing</strong></h4>
        <p>This site collects no data at all. All computation is done within your own browser and there is no data stored anywhere that we can access.</p>

        <h4><strong>Analytics</strong></h4>
        <p>Quacks.xyz uses Google Analytics to track see how people use the site. If you would like to block this, use a wonderful ad-blocking plugin like <a href='https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en' target='_target' rel='noopener'>uBlock Origin</a> to do so.</p>
      </ModalBody>
    </Modal>
  );
};

PrivacyPolicyModal.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default React.memo(PrivacyPolicyModal);
