import React from 'react';
import { Link } from 'react-router-dom';
import { FormatArtwork } from '../../../services/MusicKit';
import './MediaItemCard.scss';

interface MediaItemCardProps {
  item: any
}

const MediaItemCard: React.FC<MediaItemCardProps> = ({ item }) => {
  const albumTemplate = <>
    <Link to={`/album/${item.id}`}>
      <img src={FormatArtwork(item.attributes.artwork, 500)} className="img-fluid rounded" alt={item.attributes.name} />
      <span className="text-truncate">{item.attributes.name}</span>
    </Link>
    <span className="text-truncate">{item.attributes.artistName}</span>
  </>;
  const playlistTemplate = <>
    <Link to={`/playlist/${item.id}`}>
      <img src={FormatArtwork(item.attributes.artwork, 500)} className="img-fluid rounded" alt={item.attributes.name} />
      <span className="text-truncate">{item.attributes.name}</span>
    </Link>
    <span className="text-truncate">{item.attributes.curatorName}</span>
  </>;
  const artistTemplate = <>
    <Link to={`/artist/${item.id}`}>
      <img src={require("../../../assets/images/placeholder.jpeg")} className="img-fluid rounded" alt={item.attributes.name} />
      <span className="text-truncate">{item.attributes.name}</span>
    </Link>
  </>;

  return (
    <div className="media-item">
      {item.type === 'albums' && albumTemplate}
      {item.type === 'playlists' && playlistTemplate}
      {item.type === 'artists' && artistTemplate}
    </div>
  );
}

export default MediaItemCard;
