import _ from 'lodash';

const QueryType = {
  Artist: 1,
  Album: 2,
  PublicPlaylist: 3,
};

export const QueryTypes = [
  { label: 'Artists', value: QueryType.Artist },
  { label: 'Albums', value: QueryType.Album },
  { label: 'Public Playlists', value: QueryType.PublicPlaylist }
];

export const KeyedQueryTypes = _.keyBy(QueryTypes, 'value');

export default QueryType;
