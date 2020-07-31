import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'source-map-support/register';

export const artists: APIGatewayProxyHandler = async (event, _context): Promise<APIGatewayProxyResult> => {
  const storefront = event.queryStringParameters["storefront"];
  const paramIds = event.queryStringParameters["ids"];
  const imageOnly = (event.queryStringParameters["imageOnly"] == 'true');
  let ids: string[] = [];
  if (paramIds !== "") {
    ids = paramIds.split(",");
  }

	const response = await getArtists(ids, storefront, imageOnly);

	if (response) {
		return sendRes(200, JSON.stringify({ artists: response }));
	}

	return sendRes(404, JSON.stringify({ error: 'Requested artists not found' }));
}

const sendRes = (status: number, body: string): APIGatewayProxyResult => {
  return {
    statusCode: status,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: body
  };
}

const getArtists = async (ids: string[], storefront: string, imageOnly: boolean): Promise<AppleMusic.Artist[]> => {
  const artists: AppleMusic.Artist[] = [];
  await Promise.all(ids.map(async (id) => {
    const artist = await getArtist(id, storefront, imageOnly);
    if (artist) { artists.push(artist); }
  }));

  return artists;
}

const getArtist = async (id: string, storefront: string, imageOnly: boolean): Promise<AppleMusic.Artist> => {
  const url = `https://itunes.apple.com/${storefront}/artist/${id}`;
  let artist: AppleMusic.Artist;

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      if (!imageOnly) {
        const script = $("script[id='shoebox-ember-data-store']")[0].children[0].data;
        if (script) {
          artist = { id: id };
          artist.resources = JSON.parse(script);

          artist.resources.included = artist.resources.included.filter(item =>
            item.type === 'lockup/section' &&
            (
              !item.id.endsWith('playlists') &&
              !item.id.endsWith('Videos') && 
              !item.id.endsWith('Movies') && 
              !item.id.endsWith('Books')
            )
          );
        }
      }

      const image = $("meta[name='twitter:image']").attr('content');
      if (image) {
        artist = artist ?? { id: id };
        artist.imageUrl = `${image.substring(0, image.lastIndexOf('/'))}/{w}x{h}bb.jpeg`;
      }
    })
    .catch(console.error);

  return artist;
}
