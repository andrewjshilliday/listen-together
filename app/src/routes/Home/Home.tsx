import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Button, TextField, InputAdornment, IconButton } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useRoom, useAuthorization } from '../../components/providers';
import styled from 'styled-components';
import musicSvg from '../../assets/images/listen-together.svg';

const Home: React.FC = (props: any) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const history = useHistory();
  const roomProvider = useRoom();
  const authProvider = useAuthorization();

  useEffect(() => {
    if (roomProvider.roomId) {
      props.history.push(`/room/${roomProvider.roomId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createUser = (userName: string) => {
    roomProvider.actions.createUser(userName);
  }

  const createRoom = () => {
    roomProvider.actions.createRoom((roomId: string) => {
      if (roomId) {
        history.push(`/room/${roomId}`);
      }
    });
  };

  const joinRoom = () => {
    roomProvider.actions.joinRoom(roomId, (roomId: string) => {
      if (roomId) {
        history.push(`/room/${roomId}`);
      }
    });
  }

  return (
    <HomeContainer>
      <Title>ListenTogether</Title>
      <ListenTogetherImage src={musicSvg} />
      { !authProvider.authorized ?
        <FadeInContainer>
          <h4>To use this application, connect to your Apple Music account</h4>
          <Button variant="outlined" color="primary" onClick={() => authProvider.actions.signIn()}>Connect to Apple Music</Button>
        </FadeInContainer> :
        <FadeInContainer>
          <UsernameContainer disabled={roomProvider.username != null}>
            <h2>First, Pick a Username</h2>
            <UsernameInput label="Enter Username" onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  createUser(name);
                }
              }}
              InputProps={{ endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => createUser(name)}>
                    <ArrowForwardIcon />
                  </IconButton>
                </InputAdornment>
              ) }}
            />
          </UsernameContainer>
          <RoomChoicesContainer disabled={roomProvider.username == null}>
            <h2>Then</h2>
            <CreateButton variant="contained" color="primary" onClick={() => createRoom()}>Create a Room</CreateButton>
            <h3>Or</h3>
            <JoinRoomContainer>
              <JoinInput label="Room ID" onChange={(e) => setRoomId(e.target.value)} />
              <JoinButton variant="contained" color="primary" onClick={() => joinRoom()}>Join a Room</JoinButton>
            </JoinRoomContainer>
          </RoomChoicesContainer>
        </FadeInContainer>
      }
    </HomeContainer>
  );
}

export default Home;


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  height: 100vh;
  background: #99ccff linear-gradient(315deg, #99ccff, #e6f2ff);
  background-size: 100% 100%;
  overflow: auto;

  h1, h2, h3, h4 { margin-bottom: 10px; }
`;
const FadeInContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 340px;
  transition: opacity 300ms ease-in;
  &.fade-enter { opacity: 0; }
  &.fade-enter-active { opacity: 1; }
  &.fade-exit { opacity: 1; }
  &.fade-exit-active { opacity: 0; }
`;
const Title = styled.h1`
  font-size: 4em;
`;
const ListenTogetherImage = styled.img`
  height: 200px;
  width: 300px;
  margin: 0 auto 20px;
`;
const UsernameContainer = styled.div<{disabled: boolean}>`
  opacity: 1;
  transition: opacity 500ms ease-in-out;
  ${props => props.disabled && `
    pointer-events: none;
    opacity: 0.1;
  `}
`;
const UsernameInput = styled(TextField)`
  height: 50px;
  width: 300px;
  margin-bottom: 20px !important;
`;
const RoomChoicesContainer = styled.div<{disabled: boolean}>`
  opacity: 1;
  transition: opacity 500ms ease-in-out;
  ${props => props.disabled && `
    pointer-events: none;
    opacity: 0.1;
  `}
`;
const CreateButton = styled(Button)`
  height: 50px;
  width: 300px;
  margin-bottom: 20px !important;
`;
const JoinRoomContainer = styled.div`
  display: flex;
  height: 50px;
  margin-bottom: 20px;
`;
const JoinInput = styled(TextField)`
  width: 150px;  
`;
const JoinButton = styled(Button)`
  width: 150px;
`;
