import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupButtonDropdown } from 'reactstrap';
import { KeyedQueryTypes, QueryTypes } from '../../Enums/QueryType';

const SearchInput = ({ query, setQuery, queryType, setQueryType }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { label } = KeyedQueryTypes[queryType];

  return (
    <InputGroup size='lg'>
      <Input id='txt-artist-search' bsSize='lg' placeholder={`Search for ${label}...`} value={query} onChange={(e) => setQuery(e.target.value)} />
      <InputGroupButtonDropdown addonType='append' isOpen={isDropdownOpen} toggle={() => setIsDropdownOpen(!isDropdownOpen)}>
        <DropdownToggle caret>
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {
            _.map(QueryTypes, ({ label, value }) => {
              return (
                <DropdownItem key={value} onClick={() => setQueryType(value)}>{label}</DropdownItem>
              );
            })
          }
        </DropdownMenu>
      </InputGroupButtonDropdown>
    </InputGroup>
  );
};

SearchInput.propTypes = {
  query: PropTypes.string.isRequired,
  queryType: PropTypes.number.isRequired,
  setQuery: PropTypes.func.isRequired,
  setQueryType: PropTypes.func.isRequired,
};

export default SearchInput;
