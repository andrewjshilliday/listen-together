import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import RoomBar from './RoomBar';

jest.mock('../../providers/RoomProvider', () => require('../../../__mocks__/providers/RoomProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(
    <StaticRouter location=".">
      <RoomBar />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});
