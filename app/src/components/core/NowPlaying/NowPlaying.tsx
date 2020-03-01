import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { CircularProgress, Slider } from '@material-ui/core';
import { MusicKitService } from '../../../services';
import { ApplicationState } from '../../../store';
import { musicKitPlay, musicKitPause } from '../../../store/musicKit';
import styled from 'styled-components';

type RepeatMode = 0 | 1 | 2;

const NowPlaying: React.FC = (props: any) => {
  const dispatch = useDispatch();
  const currentPlaybackTime = useSelector((state: ApplicationState) => state.musicKit.currentPlaybackTime);
  const currentPlaybackTimeRemaining = useSelector((state: ApplicationState) => state.musicKit.currentPlaybackTimeRemaining);
  const isPlaying = useSelector((state: ApplicationState) => state.musicKit.isPlaying);
  const musicKitInstance = useSelector((state: ApplicationState) => state.musicKit.musicKitInstance);
  const nowPlayingItem = useSelector((state: ApplicationState) => state.musicKit.nowPlayingItem);
  const playbackLoading = useSelector((state: ApplicationState) => state.musicKit.playbackLoading);
  
  const handleVolumeChange = (event: any, newValue: number | number[]) => {
    return;
    /* musicKitProvider.actions.setVolume(newValue as number); */
  };

  return (
    <PlayerBar playing={nowPlayingItem != null}>
      {nowPlayingItem ?
        <>
          <NowPlayingInfoContainer>
            <Link to={`/album/${nowPlayingItem.assets[0].metadata.playlistId}`}>
              <NowPlayingArtwork src={MusicKitService.FormatArtwork(nowPlayingItem!.attributes.artwork, 70)} className="rounded" alt={nowPlayingItem!.attributes.name} />
            </Link>
            <NowPlaingText>
              <span className="text-truncate">{nowPlayingItem!.attributes.name}</span>
              <Link to={`/album/${nowPlayingItem!.assets[0].metadata.playlistId}`}><span className="text-truncate">{nowPlayingItem!.attributes.albumName}</span></Link>
              <Link to={`/artist/${nowPlayingItem!.assets[0].metadata.artistId}`}><span className="text-truncate">{nowPlayingItem!.attributes.artistName}</span></Link>
            </NowPlaingText>
          </NowPlayingInfoContainer>
          <MediaControlsContainer>
            <MediaControlsButtonContainer>
              {musicKitInstance!.player.repeatMode === 0 && <RepeatIcon repeatMode={musicKitInstance!.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>}
              {musicKitInstance!.player.repeatMode === 1 && <RepeatIcon repeatMode={musicKitInstance!.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>}
              {musicKitInstance!.player.repeatMode === 2 && <RepeatIcon repeatMode={musicKitInstance!.player.repeatMode}><i className="fas fa-redo" onClick={() => {return}}></i></RepeatIcon>}
              <PreviousIcon><i className="fas fa-backward" onClick={() => {return}}></i></PreviousIcon>
              <PlayIcon>
                {!isPlaying && !playbackLoading && <i className="fas fa-play" onClick={() => dispatch(musicKitPlay())}></i>}
                {isPlaying && !playbackLoading && <i className="fas fa-pause" onClick={() => dispatch(musicKitPause())}></i>}
                {playbackLoading && <PlaybackLoadingSpinner onClick={() => {return}}></PlaybackLoadingSpinner>}
              </PlayIcon>
              <NextIcon><i className="fas fa-forward" onClick={() => {return}}></i></NextIcon>
              <ShuffleIcon shuffleMode={musicKitInstance!.player.shuffleMode}><i className="fas fa-random" onClick={() => {return}}></i></ShuffleIcon>
            </MediaControlsButtonContainer>
            <MediaProgressBar>
              <CurrentPlaybackTime>{moment.utc(currentPlaybackTime*1000).format('mm:ss')}</CurrentPlaybackTime>
              <Slider value={currentPlaybackTime} onChange={() => {return}} max={musicKitInstance!.player.currentPlaybackDuration}></Slider>
              <CurrentPlaybackDuration>-{moment.utc(currentPlaybackTimeRemaining*1000).format('m:ss')}</CurrentPlaybackDuration>
            </MediaProgressBar>
          </MediaControlsContainer>
          <ExtraControlsContainer>
            <VolumeSlider>
              <i className="fas fa-volume-down"></i>
              <Slider max={1} min={0} step={0.01} value={musicKitInstance!.player.volume} onChange={handleVolumeChange}></Slider>
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
