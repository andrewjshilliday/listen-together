import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Slider } from '@material-ui/core';
import moment from 'moment';
import { useMusicKit } from '../../providers';
import { FormatArtwork } from '../../../services/MusicKit';
import './NowPlaying.scss';

const NowPlaying: React.FC = (props: any) => {
  const musicKitProvider = useMusicKit();
  
  const handleVolumeChange = (event: any, newValue: number | number[]) => {
    musicKitProvider.setVolume(newValue as number);
  };

  if (!musicKitProvider.nowPlayingItem) {
    return (
      <div className="player-bar not-playing">
        <h1>ListenTogether</h1>
      </div>
    )
  };
  return (
    <div className="player-bar">
      <div className="now-playing-info">
        <Link to={`/album/${musicKitProvider.nowPlayingItem.assets[0].metadata.playlistId}`}>
          <img src={FormatArtwork(musicKitProvider.nowPlayingItem.attributes.artwork, 70)} className="artwork rounded" alt={musicKitProvider.nowPlayingItem.attributes.name} />
        </Link>
        <div className="now-playing-text">
          <span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.name}</span>
          <Link to={`/album/${musicKitProvider.nowPlayingItem.assets[0].metadata.playlistId}`}><span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.albumName}</span></Link>
          <Link to={`/artist/${musicKitProvider.nowPlayingItem.assets[0].metadata.artistId}`}><span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.artistName}</span></Link>
        </div>
      </div>
      <div className="media-controls">
        <div className="media-control-buttons">
          {musicKitProvider.musicKit.player.repeatMode === 0 && <div className="repeat repeat-off"><i className="fas fa-redo" onClick={() => {return}}></i></div>}
          {musicKitProvider.musicKit.player.repeatMode === 1 && <div className="repeat repeat-one"><i className="fas fa-redo" onClick={() => {return}}></i></div>}
          {musicKitProvider.musicKit.player.repeatMode === 2 && <div className="repeat repeat-on"><i className="fas fa-redo" onClick={() => {return}}></i></div>}
          <div className="previous"><i className="fas fa-backward" onClick={() => {return}}></i></div>
          <div className="play">
            {!musicKitProvider.isPlaying && !musicKitProvider.playbackLoading && <i className="fas fa-play" onClick={() => musicKitProvider.play()}></i>}
            {musicKitProvider.isPlaying && !musicKitProvider.playbackLoading && <i className="fas fa-pause" onClick={() => musicKitProvider.pause()}></i>}
            {musicKitProvider.playbackLoading && <CircularProgress className="spinner" onClick={() => {return}}></CircularProgress>}
          </div>
          <div className="next"><i className="fas fa-forward" onClick={() => {return}}></i></div>
          <div className="shuffle"><i className="fas fa-random" onClick={() => {return}}></i></div>
        </div>
        <div className="media-progress-bar">
          <span className="current-playback-time">{moment.utc(musicKitProvider.currentPlaybackTime*1000).format('mm:ss')}</span>
          <Slider value={musicKitProvider.currentPlaybackTime} onChange={() => {return}}
            max={musicKitProvider.musicKit.player.currentPlaybackDuration}>
          </Slider>
          <span className="current-playback-duration">-{moment.utc(musicKitProvider.currentPlaybackTimeRemaining*1000).format('m:ss')}</span>
        </div>
      </div>
      <div className="extra-controls">
        <div className="volume-slider">
          <i className="fas fa-volume-down"></i>
          <Slider max={1} min={0} step={0.01} value={musicKitProvider.musicKit.player.volume} onChange={handleVolumeChange}></Slider>
          <i className="fas fa-volume-up"></i>
        </div>
      </div>
    </div>
  );
}

export default NowPlaying;
