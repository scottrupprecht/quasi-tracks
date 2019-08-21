import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import Toggle from 'react-toggle';
import { PopoverBody, PopoverHeader, UncontrolledPopover } from 'reactstrap';

class FeatureSlider extends React.PureComponent {
  render () {
    const { id, value, label, step, min, max, setReferenceValue, active, toggleIsActive, description, ...rest } = this.props;

    return (
      <div className='row' onDoubleClick={this.toggleIsActive} {...rest}>
        <div className='col-md-12'>
          <div className='float-left'>
            <label className={classnames({ 'inactive-feature-slider-label': !active })}>{label} <i id={`feature-tooltip-${id}`} className='fa fa-info-circle' /></label>
            <UncontrolledPopover placement='right' target={`feature-tooltip-${id}`} trigger='legacy'>
              <PopoverHeader>{label}</PopoverHeader>
              <PopoverBody>{description}</PopoverBody>
            </UncontrolledPopover>
          </div>
          <div className='float-right'>
            <Toggle
              checked={active}
              name='burritoIsReady'
              value='yes'
              onChange={this.toggleIsActive}
            />
          </div>
        </div>

        <div className='col-md-12'>
          <Slider
            value={value}
            disabled={!active}
            onChange={this.setReferenceValue}
            step={step}
            max={max}
            min={min}
          />
        </div>
      </div>
    );
  }

  toggleIsActive = () => {
    const { id } = this.props;
    this.props.toggleIsActive(id);
  };

  setReferenceValue = (value) => {
    const { id } = this.props;
    this.props.setReferenceValue(id, value);
  }
}

FeatureSlider.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  toggleIsActive: PropTypes.func.isRequired,
  setReferenceValue: PropTypes.func.isRequired,

};

export default FeatureSlider;
