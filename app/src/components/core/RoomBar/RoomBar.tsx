import React from 'react';
import { Link } from 'react-router-dom';
import { useRoom } from '../../providers'
import styled from 'styled-components';

const RoomBar: React.FC = (props: any) => {
  const roomProvider = useRoom();
  
  return (
    <Link to={`/room/${roomProvider.roomId}`}>
      <RoomBarContainer>
        <i className="fas fa-door-open fa-2x"></i>
      </RoomBarContainer>
    </Link>
  );
}

export default RoomBar;


const RoomBarContainer = styled.div`
  background: var(--background-darker);
  border-right: 1px solid var(--on-background);
  height: calc(100vh - 175px);
  width: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;
