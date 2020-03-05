import React, { useState, useEffect } from 'react';
import { MusicKitService, MusicKitApiService, ListenTogetherApiService } from '../../services';
import { Loading, MediaItemCardCarousel } from '../../components/common';
import styled from 'styled-components';

const Artist: React.FC = (props: any) => {
  const id = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState({} as MusicKit.MediaItem);
  const [artistImage, setArtistImage] = useState('');
  const [albums, setAlbums] = useState([] as MusicKit.MediaItem[]);
  const [singles, setSingles] = useState([] as MusicKit.MediaItem[]);
  const [liveAlbums, setLiveAlbums] = useState([] as MusicKit.MediaItem[]);
  const [compilations, setCompilations] = useState([] as MusicKit.MediaItem[]);
  const [appearsOn, setAppearsOn] = useState([] as MusicKit.MediaItem[]);
  const [playlists, setPlaylists] = useState([] as MusicKit.MediaItem[]);

  useEffect(() => {
    setArtist({} as MusicKit.MediaItem);
    setArtistImage('');
    setAlbums([] as MusicKit.MediaItem[]);
    setSingles([] as MusicKit.MediaItem[]);
    setLiveAlbums([] as MusicKit.MediaItem[]);
    setCompilations([] as MusicKit.MediaItem[]);
    setAppearsOn([] as MusicKit.MediaItem[]);
    setPlaylists([] as MusicKit.MediaItem[]);

    const getArtist = async () => {
      setLoading(true);
      setArtist(await MusicKitApiService.Artist(id, 'albums,playlists'));
      setLoading(false);
    };
    getArtist();
  }, [id]);

  useEffect(() => {
    const getArtistData = async () => {
      if (!artist.attributes) { return; }
      const artistData = await ListenTogetherApiService.Artist(id);
      setArtistImage(MusicKitService.FormatArtwork(artistData.imageUrl, 500));

      let topSongsIds: string[] = [];
      let singlesIds: string[] = [];
      let liveAlbumsIds: string[] = [];
      let compilationsIds: string[] = [];
      let appearsOnIds: string[] = [];

      for (const item of artistData.resources.included) {
        if (item.id.match(`${artist.id}/topSongs`)) {
          topSongsIds = item.relationships.content.data.map((i: any) => i.id);
        } else if (item.id.match(`${artist.id}/singleAlbums`)) {
          singlesIds = item.relationships.content.data.map((i: any) => i.id);
        } else if (item.id.match(`${artist.id}/liveAlbums`)) {
          liveAlbumsIds = item.relationships.content.data.map((i: any) => i.id);
        } else if (item.id.match(`${artist.id}/compilationAlbums`)) {
          compilationsIds = item.relationships.content.data.map((i: any) => i.id);
        } else if (item.id.match(`${artist.id}/appearsOnAlbums`)) {
          appearsOnIds = item.relationships.content.data.map((i: any) => i.id);
        }
      }

      let filteredAlbums: MusicKit.MediaItem[] = [];
      let filteredSingles: MusicKit.MediaItem[] = [];
      let filteredLiveAlbums: MusicKit.MediaItem[] = [];
      let filteredCompilations: MusicKit.MediaItem[] = [];

      for (const item of artist.relationships.albums.data) {
        if (singlesIds.indexOf(item.id) > -1) {
          filteredSingles.push(item);
        } else if (liveAlbumsIds.indexOf(item.id) > -1) {
          filteredLiveAlbums.push(item)
        } else if (compilationsIds.indexOf(item.id) > -1) {
          filteredCompilations.push(item)
        } else if (appearsOnIds.indexOf(item.id) > -1) {
          continue;
        } else {
          filteredAlbums.push(item);
        }
      }

      setSingles(filteredSingles);
      setLiveAlbums(filteredLiveAlbums);
      setCompilations(filteredCompilations);
      setAlbums(filteredAlbums);

      if (artist.relationships?.playlists?.data.length) {
        setPlaylists(artist.relationships.playlists.data);
      }

      if (appearsOnIds?.length) {
        MusicKitApiService.Albums(appearsOnIds).then(res => setAppearsOn(res));
      }
    }
    getArtistData();
  }, [artist]);

  if (loading) return (<Loading />);
  return (
    <ArtistContainer>
      <h1 className="text-truncate">{artist.attributes.name}</h1>
      <HeaderContainer>
        <ArtistImage src={artistImage !== '' ? artistImage : require("../../assets/images/placeholder.jpeg")} />
      </HeaderContainer>
      <MediaItemCardCarousel items={albums} title="Albums"></MediaItemCardCarousel>
      {singles.length > 0 && <MediaItemCardCarousel items={singles} title="EPs & Singles"></MediaItemCardCarousel>}
      {liveAlbums.length > 0 && <MediaItemCardCarousel items={liveAlbums} title="Live Albums"></MediaItemCardCarousel>}
      {compilations.length > 0 && <MediaItemCardCarousel items={compilations} title="Compilations"></MediaItemCardCarousel>}
      {appearsOn.length > 0 && <MediaItemCardCarousel items={appearsOn} title="Appears On"></MediaItemCardCarousel>}
      {playlists.length > 0 && <MediaItemCardCarousel items={playlists} title="Playlists"></MediaItemCardCarousel>}
    </ArtistContainer>
  );
}

export default Artist;


const ArtistContainer = styled.div``;
const HeaderContainer = styled.div`
  padding: 0 3em 1em;
`;
const ArtistImage = styled.img`
  border-radius: 50%;
  height: 20em;
`;
