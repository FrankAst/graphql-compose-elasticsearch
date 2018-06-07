/* @flow */

import { runDockerContainer, onExit } from '../../../scripts/docker/elasticSuggestDocker';

beforeAll(() => {
  runDockerContainer();
});

afterAll(() => {
  onExit();
});

it('run docker container', () => {
  expect(3 - 2).toBe(1);
});
