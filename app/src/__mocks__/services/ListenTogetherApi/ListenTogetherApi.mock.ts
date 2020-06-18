import ArtistResponse from "./responses/ArtistResponse";
import GeniusSongResponse from "./responses/GeniusSongResponse";

const ListenTogetherApi = {
  Album: jest.fn(() => Promise.resolve(null)),
  Artist: jest.fn(() => Promise.resolve(ArtistResponse)),
  GeniusSong: jest.fn(() => Promise.resolve(GeniusSongResponse))
};

export default ListenTogetherApi;
