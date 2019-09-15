import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReactTable from '../Base/ReactTable';
import { connect } from 'react-redux';
import Checkbox from 'react-three-state-checkbox';

class TrackAnalysisResultsTable extends React.PureComponent {
  render () {
    const { tracks, selectedTracks, isLoading, allTracksAreSelected } = this.props;

    const options = {
      className: '-striped -hover',
      data: tracks,
      loading: isLoading,
      columns: [
        {
          Header: () => (
            <Checkbox
              checked={allTracksAreSelected}
              indeterminate={!allTracksAreSelected && _.size(selectedTracks) > 0}
              onChange={this.props.globalCheckboxSelected}
            />
          ),
          id: 'checked',
          Cell: this.renderCheckbox,
          width: 30,
          className: 'text-center',
          filterable: false,
          sortable: false,
          resizable: false,
        },
        { Header: '', id: 'play', Cell: this.renderPlayButton, width: 35, className: 'text-center', filterable: false },
        { Header: 'Score', accessor: 'score', width: 75 },
        { Header: 'Name', accessor: 'name', width: 200 },
        { Header: 'Album', accessor: 'album' },
        { Header: 'Track #', accessor: 'trackNumber', width: 75 }
      ],
      getTrProps: (state, { original }) => {
        const { id } = original;

        const isSelected = _.has(selectedTracks, id);

        return {
          onClick: () => {
            this.props.setIsSelected(id, isSelected);
          },
        };
      },
      defaultSorted: [{ id: 'score' }],
    };
    return (
      <div className='bg-white'>
        <ReactTable tableId='track-analysis' {...options} />
      </div>
    );
  }

  renderCheckbox = ({ original }) => {
    const { selectedTracks } = this.props;
    const { id } = original;

    const isSelected = _.has(selectedTracks, id);

    return (
      <input type='checkbox' checked={isSelected} readOnly />
    );
  };

  renderPlayButton = ({ original }) => {
    const { uri } = original;

    return (
      <button
        className='btn btn-link' onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.props.startPlayingTrack(uri);
        }}
      ><i className='fa fa-play' />
      </button>
    );
  }
}

TrackAnalysisResultsTable.propTypes = {
  tracks: PropTypes.array.isRequired,
  selectedTracks: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  allTracksAreSelected: PropTypes.bool.isRequired,
  setIsSelected: PropTypes.func.isRequired,
  globalCheckboxSelected: PropTypes.func.isRequired,
  startPlayingTrack: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { spotify } = state;
  return {
    audioFeatures: spotify.audioFeatures,
  };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackAnalysisResultsTable);
