import React, { useEffect } from 'react';
import { useRoom } from '../../components/providers';
import { QueueMediaItemView } from '../../components/common';
import './Room.scss';

const Room: React.FC = (props: any) => {
  const roomProvider = useRoom();

  useEffect(() => {
    console.log(roomProvider.playlist);
  }, [roomProvider.playlist]);
  
  console.log(roomProvider.playlist);
  return (
    <div className="room view">
      <h1>Room {props.match.params.id}</h1>
      {roomProvider.playlist.map((item: any, index: number) => (
        <QueueMediaItemView key={item.id} item={item} index={index}></QueueMediaItemView>
      ))}
    </div>
  );
}

export default Room;
