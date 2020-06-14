import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import Header from './Header';

jest.mock('../../providers/AuthorizationProvider', () => require('../../../__mocks__/providers/AuthorizationProvider.mock').default);
jest.mock('../../providers/RoomProvider', () => require('../../../__mocks__/providers/RoomProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(
    <StaticRouter location=".">
      <Header />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});
