declare module AppleMusic {

  interface Response {
    artists?: Artist[];
    albums?: Album[];
  }

  interface Artist {
    id: string,
    imageUrl?: string;
    resources?: Resources
  }

  interface Album {
    id: string,
    resources?: Resources
  }

  interface Resources {
    data: Data;
    included: Included[];
  }

  interface Data {
    type: string;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
  }

  interface Included {
    type: string;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
  }

  interface Attributes {
    artistBio: string;
    artistId: string;
    artistName: string;
    artistUrl: string;
    bornOrFormedDate: string;
    kind: string;
    name: string;
    origin: string;
    popularity: number;
    releaseDate: string;
    trackCount: number;
    trackNumber: number;
    type: string;
    url: string;
    variant: string;
  }

  interface Relationships {
    artist: DataArray;
    artistContemporaries: DataArray;
    content: DataArray;
    listenersAlsoBought: DataArray;
    songs: DataArray;
    topAlbums: DataArray;
  }

  interface DataArray {
    data: Data[];
  }

}
