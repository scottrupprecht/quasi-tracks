import React, { useState } from 'react';
import { Form, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import QueryType, { KeyedQueryTypes } from '../../Enums/QueryType';

const SearchForm = ({ searchedText, submitArtistSearch }) => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState(QueryType.Artist);

  const { label } = KeyedQueryTypes[queryType];

  return (
    <Form onSubmit={(e) => submitArtistSearch(e, query, queryType)}>
      <SearchInput
        query={query}
        queryType={queryType}
        setQuery={setQuery}
        setQueryType={setQueryType}
      />

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 7 }}>
        <div className='float-left' style={{ flex: 1 }}>
          {searchedText && <span className='text-default' style={{ margin: 0 }}>{searchedText}</span>}
        </div>

        <div className='float-right'>
          <Button color='secondary' type='submit'>Search for {label}...</Button>
        </div>
      </div>
    </Form>
  );
};

SearchForm.propTypes = {
  searchedText: PropTypes.node,
  submitArtistSearch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ spotify }) => {
  return {
    searchedText: spotify.searchedText,
  };
};

export default connect(mapStateToProps)(SearchForm);
