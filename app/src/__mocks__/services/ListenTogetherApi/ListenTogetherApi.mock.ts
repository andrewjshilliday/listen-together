import ArtistResponse from "./responses/ArtistResponse";

const ListenTogetherApi = {
  Album: jest.fn(() => Promise.resolve(null)),
  Artist: jest.fn(() => Promise.resolve(ArtistResponse))
};

export default ListenTogetherApi;
