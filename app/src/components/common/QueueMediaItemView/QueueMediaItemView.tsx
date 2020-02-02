import React from 'react';
import { useMusicKit } from '../../providers';
import { MusicKitService } from '../../../services';
import styled from 'styled-components';

interface QueueMediaItemViewProps {
  item: MusicKit.MediaItem,
  index: number
}

const QueueMediaItemView: React.FC<QueueMediaItemViewProps> = ({ item, index }) => {
  const musicKitProvider = useMusicKit();
  
  return (
    <QueueItem>
      <img src={MusicKitService.FormatArtwork(item.attributes.artwork, 70)} className="img-fluid rounded" alt={item.attributes.name}/>
      <QueueItemText nowPlaying={musicKitProvider.musicKit.player.queue.position === index}>
        <span className="text-truncate">{item.attributes.name}</span>
        <span className="text-truncate">{item.attributes.albumName}</span>
        <span className="text-truncate">{item.attributes.artistName}</span>
      </QueueItemText>
    </QueueItem>
  );
}

export default QueueMediaItemView;


const QueueItem = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  padding: 0 15px;
  
  img {
    height: 70px;
    width: 70px;
  }
`;
const QueueItemText = styled.div<{nowPlaying: boolean}>`
  margin-left: 20px;
  overflow: hidden;
  span { display: block; }
  ${props => props.nowPlaying && `
    color: var(--primary);
  `}
`;
