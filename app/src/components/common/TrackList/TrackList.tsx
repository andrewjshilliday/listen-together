import React from 'react';
import moment from 'moment';
import { useRoom } from '../../providers';
import { MusicKitService } from '../../../services';
import styled from 'styled-components';

interface TrackListProps {
  tracks: MusicKit.MediaItem[],
  showArtwork?: boolean,
  showArtist?: boolean,
  showAlbum?: boolean
}

const TrackList: React.FC<TrackListProps> = ({ tracks, showArtwork, showArtist, showAlbum }) => {
  const roomProvider = useRoom();

  const addToPlaylist = (track: MusicKit.MediaItem) => {
    roomProvider.actions.addToPlaylist(track);
  };

  return (
    <TrackListContainer>
      {tracks.map((track: MusicKit.MediaItem) => (
        <Track key={track.id}>
          <TrackOption onClick={() => addToPlaylist(track)}><i className="fas fa-plus"></i></TrackOption>
          {showArtwork && <img src={MusicKitService.FormatArtwork(track.attributes.artwork, 44)} className="img-fluid rounded" alt={track.attributes.name} />}
          <TrackName artist={showArtist} album={showAlbum} className="text-truncate">{track.attributes.name}</TrackName>
          {showArtist && <TrackArtist className="text-truncate">{track.attributes.artistName}</TrackArtist>}
          {showAlbum && <TrackAlbum className="track-album text-truncate">{track.attributes.albumName}</TrackAlbum>}
          <TrackDuration className="track-duration">{moment.utc(track.attributes.durationInMillis).format('m:ss')}</TrackDuration>
        </Track>
      ))}
    </TrackListContainer>
  );
}

export default TrackList;


const TrackListContainer = styled.div``;
const Track = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: .5em;
  padding-right: 15px;
  &:hover { background-color: var(--background-darker); }
`;
const TrackOption = styled.div`
  display: flex;
  justify-content: center;
  width: 50px;
  &:hover {
    cursor: pointer;
    color: var(--primary);
  }
`;
const TrackName = styled.span<{artist?: boolean, album?: boolean}>`
  ${props => props.artist && props.album && `
    max-width: calc(100% - 450px);
    width: 50%;
  `}
  ${props => props.artist && !props.album && `
    max-width: calc(100% - 280px);
    width: 75%;
  `}
  ${props => !props.artist && props.album && `
    max-width: calc(100% - 280px);
    width: 75%;
  `}
  ${props => !props.artist && !props.album && `
    max-width: calc(100% - 110px);
    width: calc(100% - 110px);
  `}
`;
const TrackArtist = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;
const TrackAlbum = styled.span`
  width: 25%;
  max-width: 170px;
  min-width: 90px;
`;
const TrackDuration = styled.span`
  width: 60px;
  text-align: right;
`;