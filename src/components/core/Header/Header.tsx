import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useAuthorization } from '../../providers'
import './Header.scss';

const Header: React.FC = (props: any) => {
  const auth = useAuthorization();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const search = () => {
    if (searchQuery) {
      history.push(`/search/${searchQuery}`);
    }
  }
  
  let authButton, searchField;
  if (auth.authorized) {
    authButton = <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign Out</Button>;
    searchField = 
      <TextField
        id="standard-basic"
        label="Search"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            search();
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => search()}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />;
  } else {
    authButton = <Button variant="contained" color="primary" onClick={() => auth.signIn()}>Sign In</Button>;
  }
  return (
    <div className="header">
      <span className="logo text-truncate" onClick={() => history.push('/')}>ListenTogether</span>
      <div className="search-field">{searchField}</div>
      <div className="auth-button">{authButton}</div>
    </div>
  );
}

export default Header;
