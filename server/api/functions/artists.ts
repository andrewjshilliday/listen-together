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
    ids = paramIds.split(",")
  }

  return GetArtists(ids, storefront, imageOnly);
}

const GetArtists = async (ids: string[], storefront: string, imageOnly: boolean): Promise<APIGatewayProxyResult> => {
  const artists: AppleMusic.Artist[] = [];
  await Promise.all(ids.map(async (id) => {
    const artist = await GetArtist(id, storefront, imageOnly);
    if (artist) { artists.push(artist); }
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      artists: artists
    }, null, 2),
  };
}

const GetArtist = async (id: string, storefront: string, imageOnly: boolean): Promise<AppleMusic.Artist> => {
  const url = `https://itunes.apple.com/${storefront}/artist/${id}`;
  let artist: AppleMusic.Artist = { id: id };

  await axios(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      if (!imageOnly) {
        const script = $("script[id='shoebox-ember-data-store']")[0].children[0].data;
        if (script) {
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
        artist.imageUrl = `${image.substring(0, image.lastIndexOf('/'))}/{w}x{h}bb.jpeg`;
      }
    })
    .catch(console.error);

  return artist;
}
