import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sOrNoS } from '../../common';
import ReactTable from '../Base/ReactTable';

const AlbumSearchResultsTable = ({ albums, isLoading, onSelect }) => {
  const options = {
    className: '-striped -hover',
    data: albums,
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
              Select Album
            </button>
          );
        },
      },
      { Header: 'Album', accessor: 'name' },
      { Header: 'Artist', id: 'artist', accessor: ({ artist }) => artist ? artist.name : null },
      { Header: 'Release Date', accessor: 'releaseDate' },
      { Header: '# Tracks', accessor: 'totalTracks' }
    ],
  };
  return (
    <div className='search-results-table'>
      <div className='clearfix'>
        <div className='float-left'>
          <label>Loaded {_.size(albums)} Album{sOrNoS(albums)}</label>
        </div>
      </div>

      <div className='bg-white'>
        <ReactTable tableId='album-search-results' {...options} />
      </div>
    </div>
  );
};

AlbumSearchResultsTable.propTypes = {
  albums: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default AlbumSearchResultsTable;
