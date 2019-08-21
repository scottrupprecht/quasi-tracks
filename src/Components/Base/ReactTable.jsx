import React from 'react';
import ReactTableBase from 'react-table';
import PropTypes from 'prop-types';
import TableLoader from './TableLoader';

const ReactTable = ({ onRef, ...rest }) => {
  const options = {
    className: '-striped -hover',
    minRows: 0,
    showPageJump: false,
    showPageSizeOptions: false,
    LoadingComponent: TableLoader,
    pageSize: 10,
    ...rest,
  };

  return (
    <ReactTableBase ref={onRef} {...options} />
  );
};

ReactTable.propTypes = {
  onRef: PropTypes.func,
};

export default ReactTable;
