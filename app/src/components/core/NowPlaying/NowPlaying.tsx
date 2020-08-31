import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Slider } from '@material-ui/core';
import moment from 'moment';
import { useMusicKit } from '../../providers';
import { MusicKitService } from '../../../services';
import styled from 'styled-components';

type RepeatMode = 0 | 1 | 2;

const NowPlaying: React.FC = (props: any) => {
  const musicKitProvider = useMusicKit();
  
  const handleVolumeChange = (event: any, newValue: number | number[]) => {
    musicKitProvider.actions.setVolume(newValue as number);
  };

  return (
    <PlayerBar playing={musicKitProvider.nowPlayingItem != null}>
      {musicKitProvider.nowPlayingItem ?
        <>
          <NowPlayingInfoContainer>
            <Link to={`/album/${musicKitProvider.nowPlayingItem.assets[0].metadata.playlistId}`}>
              <NowPlayingArtwork src={MusicKitService.FormatArtwork(musicKitProvider.nowPlayingItem.attributes.artwork, 70)} className="rounded" alt={musicKitProvider.nowPlayingItem.attributes.name} />
            </Link>
            <NowPlaingText>
              <span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.name}</span>
              <Link to={`/album/${musicKitProvider.nowPlayingItem.assets[0].metadata.playlistId}`}><span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.albumName}</span></Link>
              <Link to={`/artist/${musicKitProvider.nowPlayingItem.assets[0].metadata.artistId}`}><span className="text-truncate">{musicKitProvider.nowPlayingItem.attributes.artistName}</span></Link>
            </NowPlaingText>
          </NowPlayingInfoContainer>
          <MediaControlsContainer>
            <MediaControlsButtonContainer>
              {/* {musicKitProvider.musicKit.player.repeatMode === 0 && <RepeatIcon repeatMode={musicKitProvider.musicKit.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>}
              {musicKitProvider.musicKit.player.repeatMode === 1 && <RepeatIcon repeatMode={musicKitProvider.musicKit.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>}
              {musicKitProvider.musicKit.player.repeatMode === 2 && <RepeatIcon repeatMode={musicKitProvider.musicKit.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>} */}
              <PreviousIcon><i className="fas fa-backward" onClick={() => musicKitProvider.actions.previous()}></i></PreviousIcon>
              <PlayIcon>
                {!musicKitProvider.isPlaying && !musicKitProvider.playbackLoading && <i className="fas fa-play" onClick={() => musicKitProvider.actions.play()}></i>}
                {musicKitProvider.isPlaying && !musicKitProvider.playbackLoading && <i className="fas fa-pause" onClick={() => musicKitProvider.actions.pause()}></i>}
                {musicKitProvider.playbackLoading && <PlaybackLoadingSpinner onClick={() => musicKitProvider.actions.stop()}></PlaybackLoadingSpinner>}
              </PlayIcon>
              <NextIcon><i className="fas fa-forward" onClick={() => musicKitProvider.actions.next()}></i></NextIcon>
              {/* <ShuffleIcon shuffleMode={musicKitProvider.musicKit.player.shuffleMode}><i className="fas fa-random" onClick={() => {return}}></i></ShuffleIcon> */}
            </MediaControlsButtonContainer>
            <MediaProgressBar>
              <CurrentPlaybackTime>{moment.utc(musicKitProvider.currentPlaybackTime*1000).format('mm:ss')}</CurrentPlaybackTime>
              <Slider value={musicKitProvider.currentPlaybackTime} onChangeCommitted={(e, v) => musicKitProvider.actions.seek(v)} max={musicKitProvider.musicKit.player.currentPlaybackDuration}></Slider>
              <CurrentPlaybackDuration>-{moment.utc(musicKitProvider.currentPlaybackTimeRemaining*1000).format('m:ss')}</CurrentPlaybackDuration>
            </MediaProgressBar>
          </MediaControlsContainer>
          <ExtraControlsContainer>
            <VolumeSlider>
              <i className="fas fa-volume-down"></i>
              <Slider max={1} min={0} step={0.01} value={musicKitProvider.musicKit.player.volume} onChange={handleVolumeChange}></Slider>
              <i className="fas fa-volume-up"></i>
            </VolumeSlider>
          </ExtraControlsContainer>
        </>
        :
        <h1>ListenTogether</h1>
      }
    </PlayerBar>
  );
}

export default NowPlaying;


const PlayerBar = styled.div<{playing: boolean}>`
  position: absolute;
  display: flex;
  background-color: var(--background-darker);
  color: var(--on-background);
  bottom: 0;
  border-top: 1px solid var(--on-background);
  width: 100%;
  height: 100px;

  ${props => !props.playing && `
    justify-content: center;
    align-items: center;
  `}
`;
const NowPlayingInfoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 25%;
  min-width: 270px;
  padding: 0 15px;

  .now-playing-text {
  }
`;
const NowPlayingArtwork = styled.img`
  width: 70px;
  height: 70px;
`;
const NowPlaingText = styled.div`
  margin-left: 10px;
  overflow: hidden;
  span { display: block; }
`;
const MediaControlsContainer = styled.div`
  display: block;
  width: 50%;
`;
const MediaControlsButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 11px;

  i {
    cursor: pointer;
  }
`;
const PlayIcon = styled.div`
  padding: 0 20px;
  i {
    color: var(--on-background);
    font-size: 40pt;
    &:hover { color: var(--primary); }
  }
`;
const PlaybackLoadingSpinner = styled(CircularProgress)`
  margin: 7px 3px 0 3px;
`;
const PreviousIcon = styled.div`
  i {
    color: var(--on-background);
    font-size: 30pt;
    &:hover { color: var(--primary); }
  }
`;
const NextIcon = styled.div`
  i {
    color: var(--on-background);
    font-size: 30pt;
    &:hover { color: var(--primary); }
  }
`;
const RepeatIcon = styled.div<{repeatMode: number}>`
  padding: 0 15px;
  i {
    color: var(--on-background);
    font-size: 15pt;
  }
`;
const ShuffleIcon = styled.div<{shuffleMode: number}>`
  padding: 0 15px;
  i {
    color: var(--on-background);
    font-size: 15pt;
  }
`;
const MediaProgressBar = styled.div`
  display: flex;
  padding: 0 20px;
`;
const CurrentPlaybackTime = styled.span`
  position: relative;
  top: 1px;
  color: var(--on-background);
  width: 60px;
  font-size: 11pt;
`;
const CurrentPlaybackDuration = styled(CurrentPlaybackTime)`
  text-align: end;
`;
const ExtraControlsContainer = styled.div`
  display: flex;
  width: 25%;
  min-width: 270px;
  justify-content: flex-end;
`;
const VolumeSlider = styled.div`
  display: flex;
  width: 70%;
  align-items: center;
  i { padding: 0 15px; }
`;
