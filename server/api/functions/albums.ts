import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const albums: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",")
  }

  return GetAlbums(ids, storefront);
}

const GetAlbums = async (ids: string[], storefront: string): Promise<APIGatewayProxyResult> => {
  const albums: AppleMusic.Album[] = [];
  await Promise.all(ids.map(async (id) => {
    const album = await GetAlbum(id, storefront);
    if (album) { albums.push(album); }
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      albums: albums
    }, null, 2),
  };
}

const GetAlbum = async (id: string, storefront: string): Promise<AppleMusic.Album> => {
  const url = `https://itunes.apple.com/${storefront}/album/${id}`;
  let album: AppleMusic.Album = { id: id };

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const script = $("script[id='shoebox-ember-data-store']")[0].children[0].data;

      if (script) {
        const resources = JSON.parse(script);
        album.resources = resources as AppleMusic.Resources;
        album.resources.included = album.resources.included.filter(item =>
          item.type !== 'offer' &&
          item.type !== 'image' &&
          item.type !== 'genre' &&
          item.type !== 'review' &&
          !item.type.startsWith('lockup')
        );
      }
    })
    .catch(console.error);

  return album;
}
