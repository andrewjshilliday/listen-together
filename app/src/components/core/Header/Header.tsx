import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useAuthorization, useRoom } from '../../providers'
import styled from 'styled-components';
import musicSvg from '../../../assets/images/listen-together.svg';

const Header: React.FC = (props: any) => {
  const authProvider = useAuthorization();
  const roomProvider = useRoom();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const search = () => {
    if (searchQuery) {
      history.push(`/search/${searchQuery}`);
    }
  }

  const signOut = async () => {
    authProvider.actions.signOut();
    window.location.reload();
  }
  
  let authButton, searchField;
  if (authProvider.authorized) {
    authButton = <Button variant="contained" color="primary" onClick={() => signOut()}>Sign Out</Button>;
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
    authButton = <Button variant="contained" color="primary" onClick={() => authProvider.actions.signIn()}>Sign In</Button>;
  }
  
  return (
    <HeaderContainer>
      <Logo className="text-truncate" to={roomProvider.roomId ? `/room/${roomProvider.roomId}` : `/`}>
        <img src={musicSvg} alt="ListenTogether" /> ListenTogether
      </Logo>
      {roomProvider.roomId && <SearchField>{searchField}</SearchField>}
      <AuthButton>{authButton}</AuthButton>
    </HeaderContainer>
  );
}

export default Header;


const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--background-darker);
  color: var(--on-background);
  padding: 0 25px;
  border-bottom: 1px solid var(--on-background);
  height: 75px;

  h1 {
    margin: 0;
    line-height: 75px;
  }
`;
const Logo = styled(Link)`
  margin-right: auto;
  font-size: 2em;
  font-weight: 500;

  img {
    width: 65px;
    height: 43px;
  }
`;
const SearchField = styled.div`
  padding-right: 25px;
  position: relative;
  top: -8px;
`;
const AuthButton = styled.div``;
