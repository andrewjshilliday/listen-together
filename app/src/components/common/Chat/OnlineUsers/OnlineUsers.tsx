import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip  } from 'antd';
import { ApplicationState } from '../../../../store';
import styled from 'styled-components';

const OnlineUsers: React.FC = (props: any) => {
  const users = useSelector((state: ApplicationState) => state.room.users);

  return (
    <OnlineUsersContainer>
      {
        users.length > 0 ?
          <>
            <span>Other people in this room</span>
            <UserAvatarContainer>
              {
                users.map(user =>
                  <Tooltip key={user.id} title={user.name}>
                    <AvatarIcon size="large" color={user.color}>{user.name}</AvatarIcon>
                  </Tooltip>)
              }
            </UserAvatarContainer>
          </>
          :
          <span>Looks like you're on your own here!</span>
      }
    </OnlineUsersContainer>
  );
}

export default OnlineUsers;


const OnlineUsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 75px;
  margin: 0 25px;
  border-bottom: 1px solid #ccc;
`;
const UserAvatarContainer = styled.div`
  margin: 6px 0;
`;
const AvatarIcon = styled(Avatar)<{color: string}>`
  margin: 0 5px;
  background-color: ${props => props.color};
`;
