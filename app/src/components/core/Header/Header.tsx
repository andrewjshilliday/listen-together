import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, IconButton, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ApplicationState } from '../../../store';
import { signIn, signOut } from '../../../store/authentication';
import styled from 'styled-components';
import musicSvg from '../../../assets/images/listen-together.svg';

const Header: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const authenticated = useSelector((state: ApplicationState) => state.authentication.authenticated);
  const roomId = useSelector((state: ApplicationState) => state.room.roomId);
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const search = () => {
    if (searchQuery) {
      history.push(`/search/${searchQuery}`);
    }
  }
  
  let authButton, searchField;
  if (authenticated) {
    authButton = <Button variant="contained" color="primary" onClick={() => dispatch(signOut())}>Sign Out</Button>;
    searchField = 
      <TextField
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
    authButton = <Button variant="contained" color="primary" onClick={() => dispatch(signIn())}>Sign In</Button>;
  }
  
  return (
    <HeaderContainer>
      <Logo className="text-truncate" to={roomId ? `/room/${roomId}` : `/`}>
        <img src={musicSvg} alt="ListenTogether" /> ListenTogether
      </Logo>
      {roomId && <SearchField>{searchField}</SearchField>}
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
