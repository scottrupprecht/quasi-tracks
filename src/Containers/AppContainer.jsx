import React from 'react';
import store from 'store';
import tour from 'tour';
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
import PrivacyPolicyModal from '../Components/Modals/PrivacyPolicyModal';

class AppContainer extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      selectSongModalShowing: false,
      selectArtistModalShowing: false,
      isShowingFeatureModal: false,
      isShowingPrivacyPolicyModal: false,
      query: '',
      queryType: null,
    };

    this.preSearchTour = {
      id: 'presearch',
      steps: [
        {
          target: '#txt-artist-search',
          content: 'First start by search for an Artist, Album, or Playlist.',
          disableBeacon: true,
        }
      ],
    };

    this.tracksLoadedTour = {
      id: 'post-processing',
      steps: [
        {
          target: props.isMobile ? '.mobile-parameters-modal-trigger' : '.features',
          content: 'Now that tracks are loaded, you can set parameters using the sliders and switches over here.',
        },
        {
          target: '.score-column',
          content: 'The score indicates how similar the song is to the parameters you\'ve set. The closer to zero, the better.',
        },
        {
          target: '.play-column',
          content: 'If you have Spotify open you can press the play button on any track to hear the track.',
        },
        {
          target: '.playlist-container',
          content: 'If you fine a track or two that you like, you can select (or create) a playlist and add the selected tracks to the playlist.',
        }
      ],
    };

    this.showPreSearchTour = this.showTour.bind(this, 'pre-search', this.preSearchTour);
    this.showTracksLoadedTour = this.showTour.bind(this, 'tracks-loaded', this.tracksLoadedTour);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.isProcessing && !this.props.isProcessing) {
      this.showTracksLoadedTour();
    }
  }

  render () {
    const { query, queryType, isShowingFeatureModal, isShowingPrivacyPolicyModal } = this.state;
    const { tracks, currentUserPlaylists, selectedTracks, selectedPlaylist, allTracksAreSelected, isProcessing } = this.props;

    const noResults = _.size(tracks) === 0;

    return (
      <>
        <div className='app-container'>
          <div className='features-sidebar features-sidebar-step bg-white'>
            <FeatureSidebar />
          </div>
          <main>
            <div className='header bg-gradient-primary'>
              <div>
                <SearchForm submitArtistSearch={this.submitSearch} />
              </div>
              {_.size(tracks) > 0 &&
                <div className='mobile-parameters-container'>
                  <Button className='mobile-parameters-modal-trigger' color='default' size='sm' onClick={this.showFeatureModal}><i className='fa fa-headphones' /> Set Parameters</Button>
                </div>}
            </div>
            <div className='results-step' style={{ justifyContent: noResults ? 'center' : undefined }}>
              <If condition={noResults}>
                <h2 className='text-center'>Search for songs using the form above...</h2>
              </If>
              {!noResults &&
                <div>
                  <div className='table-header-row'>
                    <div className='playlist-container'>
                      <div className='playlist-select'>
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
                      <div className='add-to-playlist'>
                        <Button color='secondary' disabled={_.isEmpty(selectedTracks) || !selectedPlaylist} size='sm' onClick={this.addTracksToPlaylist}>Add to Playlist ({_.size(selectedTracks)})</Button>
                      </div>
                    </div>
                    <div className='track-count-container'>
                      <label>Loaded {_.size(tracks)} Track{sOrNoS(tracks)}</label>
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
                </div>}
            </div>
            <div className='info-footer'>
                Quasitracks uses the <a href='https://developer.spotify.com/documentation/web-api/' rel='noopener'>Spotify API</a>. We are in no way affiliated with Spotify. <a href='javascript:void(0);' onClick={this.showPrivacyPolicy}>Privacy Policy</a> | <a href='javascript:void(0);' onClick={this.showTourOnDemand}>Give me a Tour</a>
            </div>
          </main>
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

        <PrivacyPolicyModal
          show={isShowingPrivacyPolicyModal}
          hide={this.hidePrivacyPolicy}
        />
      </>
    );
  }

  componentDidMount () {
    this.showPreSearchTour();
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

  showPrivacyPolicy = () => {
    this.setState({ isShowingPrivacyPolicyModal: true });
  };

  hidePrivacyPolicy = () => {
    this.setState({ isShowingPrivacyPolicyModal: false });
  };

  showTourOnDemand = () => {
    const { tracks } = this.props;

    const noResults = _.size(tracks) === 0;

    if (noResults) {
      this.showPreSearchTour(true);
    } else {
      this.showTracksLoadedTour(true);
    }
  };

  showTour = async (key, config, force) => {
    const storeKey = `qt_${key}_tour`;

    if (!force && store.get(storeKey)) {
      return;
    }

    await tour.start(config);
    store.set(storeKey, true);
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
