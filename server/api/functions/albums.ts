import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const albums: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",");
  }

	const response = await getAlbums(ids, storefront);

	if (response) {
		return sendRes(200, JSON.stringify({ albums: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested albums not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 
      "Access-Control-Allow-Origin": "*" 
    },
    body: body
  };
}

const getAlbums = async (ids: string[], storefront: string): Promise<AppleMusic.Album[]> => {
  const albums: AppleMusic.Album[] = [];
  await Promise.all(ids.map(async (id) => {
    const album = await getAlbum(id, storefront);
    if (album) { albums.push(album); }
  }));

  return albums;
}

const getAlbum = async (id: string, storefront: string): Promise<AppleMusic.Album> => {
  const url = `https://itunes.apple.com/${storefront}/album/${id}`;
  let album: AppleMusic.Album;

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const script = $("script[id='shoebox-ember-data-store']")[0].children[0].data;

      if (script) {
        album = { id: id };
        album.resources = JSON.parse(script);
        album.resources.included = album.resources.included.filter(item =>
          item.type !== 'offer' &&
          item.type !== 'image' &&
          item.type !== 'genre' &&
          item.type !== 'review' &&
          !item.type.startsWith('lockup')
        );
      }
    })
    .catch(() => {
      return null;
    });

  return album;
}
