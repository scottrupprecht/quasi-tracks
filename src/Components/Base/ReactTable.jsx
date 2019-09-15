import React from 'react';
import _ from 'lodash';
import ReactTableBase from 'react-table';
import PropTypes from 'prop-types';
import TableLoader from './TableLoader';
import { withSizes } from 'react-sizes';

const RANGES = [
  { min: null, max: 600, pageSize: 3 },
  { min: 601, max: 700, pageSize: 4 },
  { min: 701, max: 830, pageSize: 6 },
  { min: 831, max: 900, pageSize: 10 },
  { min: 901, max: 1000, pageSize: 11 },
  { min: 1001, max: 1200, pageSize: 14 },
  { min: 1201, max: null, pageSize: 17 }
];

const ReactTable = ({ pageSize, ...rest }) => {
  const options = {
    className: '-striped -hover',
    minRows: 0,
    showPageJump: false,
    showPageSizeOptions: false,
    LoadingComponent: TableLoader,
    pageSize: pageSize,
    ...rest,
  };

  return (
    <ReactTableBase {...options} />
  );
};

ReactTable.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onRef: PropTypes.func,
};

const mapSizesToProps = ({ height }) => {
  const { pageSize } = _.find(RANGES, ({ min, max }) => (min == null || height >= min) && (max === null || height <= max));

  return {
    pageSize: pageSize,
  };
};

export default withSizes(mapSizesToProps)(ReactTable);
