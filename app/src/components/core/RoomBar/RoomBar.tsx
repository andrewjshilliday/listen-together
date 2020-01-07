import React from 'react';
import { Link } from 'react-router-dom';
import { useRoom } from '../../providers'
import './RoomBar.scss';

const RoomBar: React.FC = (props: any) => {
  const roomProvider = useRoom();
  
  return (
    <Link to={`/room/${roomProvider.roomId}`}>
      <div className="room-bar">
        <i className="fas fa-door-open fa-2x"></i>
      </div>
    </Link>
  );
}

export default RoomBar;
