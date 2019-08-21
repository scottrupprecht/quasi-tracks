import React from 'react';
import PropTypes from 'prop-types';

const TableLoader = props => {
  const { loading, loadingText } = props;

  if (!loading) {
    return null;
  }

  return (
    <div className='-loading -active'>
      <div className='-loading-inner'>
        <h2><i className='fa fa-spin fa-cog' /> {loadingText}</h2>
      </div>
    </div>
  );
};

TableLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingText: PropTypes.string,
};

export default TableLoader;
