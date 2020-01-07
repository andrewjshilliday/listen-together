import React from 'react';
import { Link } from 'react-router-dom';
import { useMusicKit } from '../../providers';
import { FormatArtwork } from '../../../services/MusicKit';
import './QueueMediaItemView.scss';

interface QueueMediaItemViewProps {
  item: any,
  index: number
}

const QueueMediaItemView: React.FC<QueueMediaItemViewProps> = ({ item, index }) => {
  const musicKitProvider = useMusicKit();
  console.log(item);
  return (
    <div className="queue-item">
      <img src={FormatArtwork(item.attributes.artwork, 70)} className="img-fluid rounded" alt={item.attributes.name}/>
      <div className={"queue-item-text " + (musicKitProvider.musicKit.player.queue.position === index && "now-playing")}>
        <span className="text-truncate">{item.attributes.name}</span>
        <span className="text-truncate">{item.attributes.albumName}</span>
        <span className="text-truncate">{item.attributes.artistName}</span>
      </div>
    </div>
  );
}

export default QueueMediaItemView;
