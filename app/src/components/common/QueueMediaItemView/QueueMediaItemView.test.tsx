import React from 'react';
import renderer from 'react-test-renderer';
import QueueMediaItemView from './QueueMediaItemView';

jest.mock('../../../services/MusicKit');
jest.mock('../../providers/MusicKitProvider', () => require('../../../__mocks__/providers/MusicKitProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(<QueueMediaItemView item={require('../../../__mocks__/objects/Album.mock').default} index={0} />).toJSON();
  expect(tree).toMatchSnapshot();
});
