import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import FeatureSlider from './FeatureSlider';
import { spotifyActionCreators } from '../modules/spotify/actions';
import { connect } from 'react-redux';

const FeatureSidebar = ({ parameters, toggleIsActive, setReferenceValue }) => {
  return (
    <div className='features' style={{ flex: 1, flexGrow: 1, overflowX: 'hidden', overflowY: 'auto', paddingLeft: 30, paddingRight: 30 }}>
      {
        _.map(parameters, (analysis, id) => {
          return (
            <div key={id} className='feature-slider'>
              <FeatureSlider
                id={id}
                {...analysis}
                style={{ marginBottom: 7 }}
                toggleIsActive={toggleIsActive}
                setReferenceValue={setReferenceValue}
              />
            </div>
          );
        })
      }
    </div>
  );
};

const mapStateToProps = ({ spotify }) => {
  return {
    parameters: spotify.parameters,
    parametersAreDirty: spotify.parametersAreDirty,
    selectedTrack: spotify.selectedTrack,
  };
};

const mapDispatchToProps = {
  resetFeaturesToReferenceSong: spotifyActionCreators.resetFeaturesToReferenceSong,
  setReferenceValue: spotifyActionCreators.setReferenceValue,
  toggleIsActive: spotifyActionCreators.toggleIsActive,
};

FeatureSidebar.propTypes = {
  parameters: PropTypes.object.isRequired,
  toggleIsActive: PropTypes.func.isRequired,
  setReferenceValue: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeatureSidebar);
