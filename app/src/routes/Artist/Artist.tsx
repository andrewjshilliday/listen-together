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
      <div className="container-fluid" id="image">
        <div className="artist-image">
          <img className="img-fluid rounded-circle" src={artistImage !== '' ? artistImage : require("../../assets/images/placeholder.jpeg")} />
        </div>
        {/* <div *ngIf="playerService.artist && playerService.artist.relationships.albums.data && playerService.artist.relationships.albums.data | albumFilter : 'latestRelease'" class="latest">
          <h5 class="text-truncate" title="Latest Release">Latest Release</h5>
          <app-media-item-view [item]="playerService.artist.relationships.albums.data | albumFilter : 'latestRelease'"></app-media-item-view>
        </div>
        <div *ngIf="playerService.artist && playerService.artist.relationships.albums.data && playerService.artist.relationships.albums.data | albumFilter : 'upcomingRelease'" class="upcoming">
          <h5 class="text-truncate" title="Upcoming Release">Upcoming Release</h5>
          <app-media-item-view [item]="playerService.artist.relationships.albums.data | albumFilter : 'upcomingRelease'"></app-media-item-view>
        </div> */}
      </div>
      { <MediaItemCardCarousel items={albums} title="Albums"></MediaItemCardCarousel> }
      { <MediaItemCardCarousel items={singles} title="EPs & Singles"></MediaItemCardCarousel> }
      { <MediaItemCardCarousel items={liveAlbums} title="Live Albums"></MediaItemCardCarousel> }
      { <MediaItemCardCarousel items={compilations} title="Compilations"></MediaItemCardCarousel> }
      { <MediaItemCardCarousel items={appearsOn} title="Appears On"></MediaItemCardCarousel> }
      { <MediaItemCardCarousel items={playlists} title="Playlists"></MediaItemCardCarousel> }
    </ArtistContainer>
  );
}

export default Artist;


const ArtistContainer = styled.div``;
