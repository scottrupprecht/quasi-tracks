import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { sOrNoS } from '../../common';
import ReactTable from '../Base/ReactTable';

const PublicPlaylistSearchResultsTable = ({ playlists, isLoading, onSelect }) => {
  const options = {
    className: '-striped -hover',
    data: playlists,
    loading: isLoading,
    columns: [
      {
        Header: '',
        id: 'select',
        width: 125,
        // eslint-disable-next-line react/prop-types
        Cell: ({ original }) => {
          return (
            <button className='btn btn-sm btn-primary' onClick={() => onSelect(original)}>
              Select Playlist
            </button>
          );
        },
      },
      { Header: 'Playlist Name', accessor: 'name' },
      { Header: 'Owner', id: 'owner', accessor: ({ owner }) => owner ? owner.display_name : null },
      { Header: '# Tracks', accessor: 'totalTracks' }
    ],
  };
  return (
    <div className='search-results-table'>
      <div className='clearfix'>
        <div className='float-left'>
          <label>Loaded {_.size(playlists)} Playlist{sOrNoS(playlists)}</label>
        </div>
      </div>

      <div className='bg-white'>
        <ReactTable tableId='public-playlist-search' {...options} />
      </div>
    </div>
  );
};

PublicPlaylistSearchResultsTable.propTypes = {
  playlists: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default PublicPlaylistSearchResultsTable;
