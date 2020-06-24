import axios from 'axios';
declare const MusicKit: any;
const LISTEN_TOGETHER_API = process.env.REACT_APP_LISTEN_TOGETHER_API_URL;

type types = 'songs' | 'artists' | 'albums' | 'playlists';

interface ListenTogetherApiService {
  Artist: (id: string, imageOnly?: boolean) => Promise<any>
  Artists: (ids: string[], imageOnly?: boolean) => Promise<any[]>
  Album: (id: string) => Promise<any>
  Albums: (ids: string[]) => Promise<any[]>
  GeniusSong: (artist: string, song: string, includeLyrics?: boolean) => Promise<any>
}

const Artist = async (id: string, imageOnly?: boolean): Promise<any> => {
  const url = `${LISTEN_TOGETHER_API}/artists`;
  let params: any = {
    ids: id,
    storefront: MusicKit.getInstance().storefrontId,
    imageOnly: imageOnly ?? false
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.artists[0];
}

const Artists = async (ids: string[], imageOnly?: boolean): Promise<any> => {
  const url = `${LISTEN_TOGETHER_API}/artists`;
  let params: any = {
    ids: ids.join(','),
    storefront: MusicKit.getInstance().storefrontId,
    imageOnly: imageOnly ?? false
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.artists;
}

const Album = async (id: string): Promise<any> => {
  const url = `${LISTEN_TOGETHER_API}/albums`;
  let params: any = {
    ids: id,
    storefront: MusicKit.getInstance().storefrontId
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.albums[0];
}

const Albums = async (ids: string[]): Promise<any[]> => {
  const url = `${LISTEN_TOGETHER_API}/albums`;
  let params: any = {
    ids: ids.join(','),
    storefront: MusicKit.getInstance().storefrontId
  };

  const resp = await axios.get(url, { params: params });
  return resp.data.albums;
}

const GeniusSong = async (artist: string, song: string, includeLyrics?: boolean): Promise<any> => {
  const url = `${LISTEN_TOGETHER_API}/genius/song`;
  let params: MusicKit.QueryParameters = {
    artist: artist,
    song: song,
    includeLyrics: includeLyrics ?? false
  }

  const resp = await axios.get(url, { params: params });
  return resp.data.song;
}

export const ListenTogetherApiService: ListenTogetherApiService = {
  Artist,
  Artists,
  Album,
  Albums,
  GeniusSong
}
