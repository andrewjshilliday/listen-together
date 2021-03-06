import React, { useState, useEffect, createRef, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { MusicKitService, MusicKitApiService, ListenTogetherApiService } from '../../services';
import { Loading, TrackList, MediaItemCardCarousel } from '../../components/common';
import styled from 'styled-components';

const Album: React.FC = (props: any) => {
  const id = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState({} as MusicKit.MediaItem);
  const [artistAlbums, setArtistAlbums] = useState([] as MusicKit.MediaItem[]);
  const [relatedAlbums, setRelatedAlbums] = useState([] as MusicKit.MediaItem[]);
  const [duration, setDuration] = useState('');
  const albumRef = useRef<MusicKit.MediaItem>(album);
  const notesRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setAlbum({} as MusicKit.MediaItem);
    setArtistAlbums([] as MusicKit.MediaItem[]);
    setRelatedAlbums([] as MusicKit.MediaItem[]);
    setDuration('');

    const getAlbum = async () => {
      setLoading(true);
      setAlbum(await MusicKitApiService.Album(id));
      setLoading(false);
    };
    getAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (album.relationships) {
      let durationInMillis
      let hours = 0, minutes = 0;
      let durationString = '';
      
      durationInMillis = moment.duration(album.relationships.tracks.data.map((i: MusicKit.MediaItem) => i.attributes.durationInMillis)
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

    const getAlbumData = async () => {
      if (album.relationships?.artists) {
        MusicKitApiService.Artist(album.relationships.artists.data[0].id, 'albums').then(res => {
          setArtistAlbums(res.relationships.albums.data);
        })
      }
  
      const albumData = await ListenTogetherApiService.Album(id);
      if (!albumData?.resources.data.relationships.listenersAlsoBought) { return; }
  
      const relatedAlbumsIds = albumData.resources.data.relationships.listenersAlsoBought.data.map((i: any) => i.id);
      MusicKitApiService.Albums(relatedAlbumsIds).then (res => {
        setRelatedAlbums(relatedAlbums);
      });
    }

    getAlbumData();

    albumRef.current = album;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [album])

  useLayoutEffect(() => {
    setEditorialNotesStyle();
    window.addEventListener('resize', setEditorialNotesStyle);
    return () => window.removeEventListener('resize', setEditorialNotesStyle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesRef]);
  
  const setEditorialNotesStyle = () => {
    if (!albumRef.current?.attributes?.editorialNotes || !notesRef.current) {
      return;
    }

    const height = window.innerHeight;
    const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
    notesRef.current.style.maxHeight = `${height - notesOffsetTop - 110}px`;
  };

  if (loading) return (<Loading />);
  
  return (
    <AlbumContainer>
      <AlbumTracksContainer>
        <SidebarContainer>
          <StickySidebar>
            <img src={MusicKitService.FormatArtwork(album.attributes.artwork, 500)} className="img-fluid rounded" alt={album.attributes.name} />
            <p>{album.relationships.tracks.data.length} Songs, {duration}</p>
            {
              album.attributes.editorialNotes &&
              <>
                <hr />
                <EditorialNotes ref={notesRef}>
                {
                  album.attributes.editorialNotes.standard ?
                  <span dangerouslySetInnerHTML={{ __html: `${album.attributes.editorialNotes.standard}` }}></span> :
                  <span dangerouslySetInnerHTML={{ __html: `${album.attributes.editorialNotes.short}`}}></span>
                }
                </EditorialNotes>
              </>
            }
          </StickySidebar>
        </SidebarContainer>
        <TrackListContainer>
          <TrackListHeader>
            <h1 className="text-truncate">{album.attributes.name}</h1>
            <ArtistGenre>
              <Link to={`/artist/${album.relationships.artists.data[0].id}`}><h2 className="text-truncate">{album.attributes.artistName}</h2></Link>
              <h2>{album.attributes.genreNames && (<>&nbsp;| {album.attributes.genreNames[0]}</>)}</h2>
            </ArtistGenre>
          </TrackListHeader>
          <TrackList tracks={album.relationships.tracks.data}></TrackList>
          <ReleaseDate>
            Released: {moment(album.attributes.releaseDate).format('dddd, MMMM D, YYYY')} <br />
            {album.attributes.recordLabel} | {album.attributes.copyright}
          </ReleaseDate>
        </TrackListContainer>
      </AlbumTracksContainer>
      {
        artistAlbums.length > 0 && 
        <AdditionalAlbumsContainer>
          <MediaItemCardCarousel items={artistAlbums} title={`More By ${album.attributes.artistName}`}></MediaItemCardCarousel> 
        </AdditionalAlbumsContainer>
      }
      {
        relatedAlbums.length > 0 && 
        <AdditionalAlbumsContainer>
          <MediaItemCardCarousel items={relatedAlbums} title={`You Might Also Like`}></MediaItemCardCarousel> 
        </AdditionalAlbumsContainer>
      }
    </AlbumContainer>
  );
}

export default Album;


const AlbumContainer = styled.div``;
const AlbumTracksContainer = styled.div`
  display: flex;
`;
const SidebarContainer = styled.div`
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
const ReleaseDate = styled.p`
  font-size: 10pt;
  margin: 10px 15px;
`;
const ArtistGenre = styled.div`
  display: flex;
`;
const AdditionalAlbumsContainer = styled.div`
  margin: 0 10px;
`;
