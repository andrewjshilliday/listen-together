import axios from 'axios';
declare const MusicKit: any;

const APPLE_MUSIC_API = 'https://api.music.apple.com';

function getHeaders() {
  const musicKit = MusicKit.getInstance();

  return {
    Authorization: `Bearer ${musicKit.developerToken}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Music-User-Token': musicKit.musicUserToken,
  };
}

export async function MKSearch(term: string, types?: string, limit?: number): Promise<any> {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/search`;
  let params: any = {
    term: term
  };

  if (types) { params.types = types; }
  if (limit) { params.limit = limit.toString(); }

  const resp = await axios.get(url, { headers: getHeaders(), params: params });
  return resp.data.results;
}

export async function MKAlbum(id: string, include?: string): Promise<any> {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/albums/${id}`;
  let params: any = {};

  if (include) { params.include = include; }

  const resp = await axios.get(url, { headers: getHeaders(), params: params });
  return resp.data.data[0];
}

export async function MKPlaylist(id: string, include?: string): Promise<any> {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/playlists/${id}`;
  let params: any = {};

  if (include) { params.include = include; }

  const resp = await axios.get(url, { headers: getHeaders(), params: params });
  return resp.data.data[0];
}

export async function MKArtist(id: string, include?: string): Promise<any> {
  const url = `${APPLE_MUSIC_API}/v1/catalog/${MusicKit.getInstance().storefrontId}/artists/${id}`;
  let params: any = {};

  if (include) { params.include = include; }

  const resp = await axios.get(url, { headers: getHeaders(), params: params });
  return resp.data.data[0];
}
