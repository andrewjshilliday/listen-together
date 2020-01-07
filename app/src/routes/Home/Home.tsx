import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { useRoom } from '../../components/providers';
import './Home.scss';

const Home: React.FC = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const history = useHistory();
  const roomProvider = useRoom();

  const createRoom = () => {
    roomProvider.createRoom();
    /* history.push(`/room/${roomProvider.roomId}`); */
  };

  const joinRoom = () => {
    roomProvider.joinRoom(roomId);
    /* history.push(`/room/${roomProvider.roomId}`); */
  }

  return (
    <div className="home view">
      <Button className="create-button" variant="contained" color="primary" onClick={() => createRoom()}>Create a Room</Button>
      <Button className="create-button" variant="contained" color="primary" onClick={() => joinRoom()}>Join a Room</Button>
      <input type="text" placeholder="name" onChange={(event: any) => { setName(event.target.value); console.log(event.target.value); }}></input>
      <input type="text" placeholder="room" onChange={(event: any) => { setRoomId(event.target.value); console.log(event.target.value); }}></input>
    </div>
  );
}

export default Home;
