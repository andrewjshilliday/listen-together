import React from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { useRoom } from '../../components/providers';
import './Home.scss';

const Home: React.FC = () => {
  const history = useHistory();
  const room = useRoom();

  const createRoom = () => {
    const roomId = 'DJGFE';
    if (!room.roomId) {
      room.setRoomId(roomId);
    }
    history.push(`/room/${roomId}`);
  };

  return (
    <div className="home view">
      <Button className="create-button" variant="contained" color="primary" onClick={() => createRoom()}>Create a Room</Button>
    </div>
  );
}

export default Home;
