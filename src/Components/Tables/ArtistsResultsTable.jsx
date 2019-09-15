import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sOrNoS } from '../../common';
import ReactTable from '../Base/ReactTable';
import { withSizes } from 'react-sizes';

const ArtistsResultsTable = ({ artists, isLoading, isMobile, onSelect }) => {
  const options = {
    className: '-striped -hover',
    data: artists,
    loading: isLoading,
    columns: [
      {
        Header: '',
        id: 'select',
        width: 115,
        // eslint-disable-next-line react/prop-types
        Cell: ({ original }) => {
          return (
            <button className='btn btn-sm btn-primary' onClick={() => onSelect(original)}>
              Select Artist
            </button>
          );
        },
      },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Popularity', accessor: 'popularity', show: !isMobile },
      { Header: 'Followers', id: 'followers', accessor: ({ followers }) => followers ? followers.total : null, show: !isMobile }
    ],
  };
  return (
    <div className='search-results-table'>
      <div className='clearfix'>
        <div className='float-left'>
          <label>Loaded {_.size(artists)} Artist{sOrNoS(artists)}</label>
        </div>
      </div>

      <div className='bg-white'>
        <ReactTable tableId='artist-results' {...options} />
      </div>
    </div>
  );
};

ArtistsResultsTable.propTypes = {
  artists: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 992,
});

export default withSizes(mapSizesToProps)(ArtistsResultsTable);
