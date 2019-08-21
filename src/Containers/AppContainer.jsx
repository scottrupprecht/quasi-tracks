import React from 'react';
import PropTypes from 'prop-types';
import FeatureSidebar from '../QuasiTracks/FeatureSidebar';
import SearchForm from '../Components/Search/SearchForm';
import { If } from 'react-if';
import Creatable from 'react-select/creatable/dist/react-select.esm';
import Button from 'reactstrap/es/Button';
import _ from 'lodash';
import { sOrNoS } from '../common';
import TrackAnalysisResultsTable from '../Components/Tables/TrackAnalysisResultsTable';
import { areAllTracksSelected, getTrackResults } from '../modules/spotify/selectors';
import { authActionCreators } from '../modules/auth/actions';
import { spotifyActionCreators } from '../modules/spotify/actions';
import { withSizes } from 'react-sizes';
import { connect } from 'react-redux';
import SelectArtistModal from '../Components/Modals/SelectArtistModal';
import QueryType from '../Enums/QueryType';
import SelectAlbumModal from '../Components/Modals/SelectAlbumModal';
import SelectPublicPlaylistModal from '../Components/Modals/SelectPublicPlaylistModal';
import FeatureModal from '../Components/Modals/FeatureModal';

class AppContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      selectSongModalShowing: false,
      selectArtistModalShowing: false,
      isShowingFeatureModal: false,
      query: '',
      queryType: null,
    };
  }

  render () {
    const { query, queryType, isShowingFeatureModal } = this.state;
    const { tracks, currentUserPlaylists, selectedTracks, selectedPlaylist, allTracksAreSelected, isProcessing } = this.props;

    const noResults = _.size(tracks) === 0;

    return (
      <>
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'row-reverse' }}>
          <div className='features-sidebar features-sidebar-step bg-white' style={{ flex: 3, overflowY: 'auto', paddingTop: 10, paddingBottom: 10 }}>
            <FeatureSidebar />
          </div>
          <div style={{ flex: 10, display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
            <div className='header bg-gradient-primary'>
              <SearchForm submitArtistSearch={this.submitSearch} />
            </div>
            <div className='results-step' style={{ display: 'flex', flex: 1, overflowY: 'auto', flexDirection: 'column', justifyContent: noResults ? 'center' : undefined }}>
              <If condition={noResults}>
                <h2 className='text-center' style={{ padding: 10 }}>Search for songs using the form above...</h2>
              </If>
              <If condition={!noResults}>
                <div style={{ padding: 10 }}>
                  <div className='table-header-row' style={{ marginBottom: 10 }}>
                    <div className='float-left'>
                      <Creatable
                        className='playlist-select'
                        placeholder='Select a Playlist...'
                        onChange={this.props.selectCurrentUserPlaylist}
                        onCreateOption={this.props.createNewPlaylist}
                        value={selectedPlaylist}
                        options={currentUserPlaylists}
                        styles={{ menu: base => ({ ...base, zIndex: 11 }) }}
                        formatCreateLabel={(value) => `Create Playlist: '${value}'`}
                        classNamePrefix='react-select'
                      />
                    </div>
                    <div className='float-left'>
                      <Button color='secondary' disabled={_.isEmpty(selectedTracks) || !selectedPlaylist} size='sm' onClick={this.addTracksToPlaylist}>Add to Playlist ({_.size(selectedTracks)})</Button>
                    </div>
                    <div className='fill'>
                      <div className='float-right'>
                        <label>Loaded {_.size(tracks)} Track{sOrNoS(tracks)}</label>
                      </div>
                    </div>
                  </div>

                  <TrackAnalysisResultsTable
                    tracks={tracks}
                    isLoading={isProcessing}
                    allTracksAreSelected={allTracksAreSelected}
                    selectedTracks={selectedTracks}
                    setIsSelected={this.props.toggleTrackSelected}
                    globalCheckboxSelected={this.props.globalCheckboxSelected}
                    startPlayingTrack={this.props.startPlayingTrack}
                  />
                </div>

              </If>
            </div>
            <div className='info-footer'>
                Quasitracks uses the outstanding <a href='https://developer.spotify.com/documentation/web-api/' rel='noopener'>Spotify API</a>. We are in no way affiliated with Spotify.
            </div>
          </div>

          {/* <div className="fab-container"> */}
          {/*  <Button className="features-button-step" color="primary" onClick={this.showFeatureModal}><i className="fa fa-headphones"/> Set Parameters</Button> */}
          {/* </div> */}
        </div>
        <SelectArtistModal
          show={!!query && queryType === QueryType.Artist}
          searchQuery={query}
          selectArtist={this.selectArtist}
          hide={this.hideSearchModal}
        />

        <SelectAlbumModal
          show={!!query && queryType === QueryType.Album}
          searchQuery={query}
          selectAlbum={this.selectAlbum}
          hide={this.hideSearchModal}
        />

        <SelectPublicPlaylistModal
          show={!!query && queryType === QueryType.PublicPlaylist}
          searchQuery={query}
          selectPublicPlaylist={this.selectPublicPlaylist}
          hide={this.hideSearchModal}
        />

        <FeatureModal
          show={isShowingFeatureModal}
          hide={this.hideFeatureModal}
        />
      </>
    );
  }

  submitSearch = (e, query, queryType) => {
    e.preventDefault();

    this.showSearchModal(query, queryType);
  };

  showFeatureModal = () => {
    this.setState({ isShowingFeatureModal: true });
  };

  hideFeatureModal = () => {
    this.setState({ isShowingFeatureModal: false });
  };

  showSearchModal = (query, queryType) => {
    if (!_.trim(query)) {
      return;
    }

    switch (queryType) {
      case QueryType.Artist: {
        this.props.searchForArtists(query);
        break;
      }
      case QueryType.Album: {
        this.props.searchForAlbums(query);
        break;
      }
      case QueryType.PublicPlaylist: {
        this.props.searchForPublicPlaylists(query);
        break;
      }
    }

    this.setState({ query: query, queryType: queryType });
  };

  hideSearchModal = () => {
    this.setState({ queryType: null });
  };

  selectArtist = (artist) => {
    this.hideSearchModal();
    this.props.selectArtist(artist);
  };

  selectAlbum = (album) => {
    this.hideSearchModal();
    this.props.selectAlbum(album);
  };

  selectPublicPlaylist = (playlist) => {
    this.hideSearchModal();
    this.props.selectPublicPlaylist(playlist);
  };

  addTracksToPlaylist = () => {
    const { selectedPlaylist, selectedTracks, tracks } = this.props;

    const dtos = _.filter(tracks, ({ id }) => _.has(selectedTracks, id));

    this.props.addTracksToPlaylist(selectedPlaylist.id, _.map(dtos, 'uri'));
  };
}

AppContainer.propTypes = {
  selectedPlaylist: PropTypes.object,
  tracks: PropTypes.array.isRequired,
  currentUserPlaylists: PropTypes.array.isRequired,
  allTracksAreSelected: PropTypes.bool.isRequired,
  selectedTracks: PropTypes.object.isRequired,
  globalCheckboxSelected: PropTypes.func.isRequired,
  toggleTrackSelected: PropTypes.func.isRequired,
  selectCurrentUserPlaylist: PropTypes.func.isRequired,
  createNewPlaylist: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  addTracksToPlaylist: PropTypes.func.isRequired,
  searchForArtists: PropTypes.func.isRequired,
  searchForAlbums: PropTypes.func.isRequired,
  searchForPublicPlaylists: PropTypes.func.isRequired,
  selectArtist: PropTypes.func.isRequired,
  selectAlbum: PropTypes.func.isRequired,
  selectPublicPlaylist: PropTypes.func.isRequired,
  startPlayingTrack: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { spotify } = state;
  return {
    isProcessing: spotify.isProcessing,
    currentUserPlaylists: spotify.currentUserPlaylists,
    selectedPlaylist: spotify.selectedPlaylist,
    selectedTracks: spotify.selectedTracks,
    tracks: getTrackResults(state),
    allTracksAreSelected: areAllTracksSelected(state),
  };
};

const mapDispatchToProps = {
  setAccessToken: authActionCreators.setAccessToken,
  getCurrentUser: spotifyActionCreators.getCurrentUser,
  setReferenceValue: spotifyActionCreators.setReferenceValue,
  resetFeaturesToReferenceSong: spotifyActionCreators.resetFeaturesToReferenceSong,
  toggleTrackSelected: spotifyActionCreators.toggleTrackSelected,
  globalCheckboxSelected: spotifyActionCreators.globalCheckboxSelected,
  selectArtist: spotifyActionCreators.selectArtist,
  selectAlbum: spotifyActionCreators.selectAlbum,
  selectPublicPlaylist: spotifyActionCreators.selectPublicPlaylist,
  searchForArtists: spotifyActionCreators.searchForArtists,
  searchForAlbums: spotifyActionCreators.searchForAlbums,
  searchForPublicPlaylists: spotifyActionCreators.searchForPublicPlaylists,
  selectCurrentUserPlaylist: spotifyActionCreators.selectCurrentUserPlaylist,
  createNewPlaylist: spotifyActionCreators.createNewPlaylist,
  startProcessing: spotifyActionCreators.startProcessing,
  startPlayingTrack: spotifyActionCreators.startPlayingTrack,
  getCurrentUsersPlaylists: spotifyActionCreators.getCurrentUsersPlaylists,
  addTracksToPlaylist: spotifyActionCreators.addTracksToPlaylist,
};

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 992,
});

export default withSizes(mapSizesToProps)(connect(mapStateToProps, mapDispatchToProps)(AppContainer));