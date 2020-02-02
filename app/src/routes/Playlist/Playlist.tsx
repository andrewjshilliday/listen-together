import React, { useState, useEffect, createRef, useLayoutEffect, useRef } from 'react';
import moment from 'moment';
import { MusicKitService, MusicKitApiService } from '../../services';
import { Loading, TrackList, MediaItemCardCarousel } from '../../components/common';
import styled from 'styled-components';

const Playlist: React.FC = (props: any) => {
  const id = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState({} as MusicKit.MediaItem);
  const [featuredArtists, setFeaturedArtists] = useState([] as MusicKit.MediaItem[]);
  const [duration, setDuration] = useState('');
  const playlistRef = useRef<MusicKit.MediaItem>(playlist);
  const notesRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const getPlaylist = async () => {
      setLoading(true);
      setPlaylist(await MusicKitApiService.Playlist(id));
      setLoading(false);
    };
    getPlaylist();
  }, [id]);

  useEffect(() => {
    if (playlist.relationships) {
      let durationInMillis
      let hours = 0, minutes = 0;
      let durationString = '';

      durationInMillis = moment.duration(playlist.relationships.tracks.data.map((i: MusicKit.MediaItem) => i.attributes.durationInMillis)
        .reduce((a: number, b: number) => a + b, 0));
      hours = Math.floor(durationInMillis.asHours());
      durationInMillis = moment.duration(durationInMillis.asMilliseconds() - (hours * 60 * 60 * 1000));
      minutes = Math.round(durationInMillis.asMinutes());

      if (hours) {
        durationString += `${hours} Hour`;
        if (hours > 1) { durationString += 's' }
        durationString += ' '
      }
      durationString += `${minutes} Minute`;
      if (minutes > 1) { durationString += 's' }

      setDuration(durationString);
    }

    const getTrackRelationships = async () => {
      if (!playlist.relationships) { return }
      const tracks = await MusicKitApiService.Songs(playlist.relationships.tracks.data.map((i: MusicKit.MediaItem) => i.id));
      const artistIds = tracks.map((r: MusicKit.MediaItem) => r.relationships.artists.data[0].id)
        .filter((v: MusicKit.MediaItem, i: number, a: MusicKit.MediaItem[]) => a.indexOf(v) === i);
      setFeaturedArtists(await MusicKitApiService.Artists(artistIds));
    }
    getTrackRelationships();
  }, [playlist]);

  useLayoutEffect(() => {
    setEditorialNotesStyle();
    window.addEventListener('resize', setEditorialNotesStyle);
    return () => window.removeEventListener('resize', setEditorialNotesStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesRef]);
  
  const setEditorialNotesStyle = () => {
    if (!playlistRef.current?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const height = window.innerHeight;
    const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    notesRef.current.style.maxHeight = `${height - notesOffsetTop - 110}px`;
  };

  if (loading) return (<Loading />);
  
  return (
    <PlaylistContainer>
      <PlaylistTracksContainer>
        <SidebarContainer>
          <StickySidebar>
            <img src={MusicKitService.FormatArtwork(playlist.attributes.artwork, 500)} className="img-fluid rounded" alt={playlist.attributes.name} />
            <p>{playlist.relationships.tracks.data.length} Songs, {duration}</p>
            {
              playlist.attributes.editorialNotes &&
              <>
                <hr />
                <EditorialNotes ref={notesRef}>
                {
                  playlist.attributes.editorialNotes.standard ?
                  <span dangerouslySetInnerHTML={{ __html: `${playlist.attributes.editorialNotes.standard}` }}></span> :
                  <span dangerouslySetInnerHTML={{ __html: `${playlist.attributes.editorialNotes.short}`}}></span>
                }
                </EditorialNotes>
              </>
            }
          </StickySidebar>
        </SidebarContainer>
        <TrackListContainer>
          <TrackListHeader>
            <h1 className="text-truncate">{playlist.attributes.name}</h1>
            <CuratorLastModified>
              <h2 className="text-truncate">{playlist.attributes.curatorName}</h2>
              <h2 title={moment.utc(playlist.attributes.lastModifiedDate).format('DD/MM/YYYY HH:mm:ss')}>&nbsp;| Last Modified: {moment.utc(playlist.attributes.lastModifiedDate).fromNow()}</h2>
            </CuratorLastModified>
          </TrackListHeader>
          <TrackList tracks={playlist.relationships.tracks.data} showArtist={true} showAlbum={true}></TrackList>
        </TrackListContainer>
      </PlaylistTracksContainer>
      {
        featuredArtists.length &&
        <FeaturedArtistsContainer>
          <MediaItemCardCarousel items={featuredArtists} title='Featured Artists'></MediaItemCardCarousel>
        </FeaturedArtistsContainer>
      }
    </PlaylistContainer>
  );
}

export default Playlist;


const PlaylistContainer = styled.div``;
const PlaylistTracksContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
  width: 30%;
  min-width: 250px;
  max-width: 400px;
  padding: 10px 15px;
`;
const StickySidebar = styled.div`
  position: sticky;
  top: 10px;
`;
const EditorialNotes = styled.div`
  overflow: auto;
  font-size: 10pt;
`;
const TrackListContainer = styled.div`
  width: 70%;
  padding-left: 15px;
`;
const TrackListHeader = styled.div`
  position: sticky;
  top: 0;
  padding-bottom: 10px;
  background: white;
`;
const CuratorLastModified = styled.div`
  display: flex;
`;
const FeaturedArtistsContainer = styled.div`
  margin: 0 10px;
`;
