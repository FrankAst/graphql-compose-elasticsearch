/* @flow */

import { Resolver } from 'graphql-compose';
import createFindByIdResolver, * as FindById from '../findById';
import elasticClient from '../../__mocks__/elasticClient';
import { CvTC, CvFieldMap } from '../../__mocks__/cv';

const findByIdResolver = createFindByIdResolver(CvFieldMap, CvTC, {
  elasticClient,
  elasticIndex: 'cv',
  elasticType: 'cv',
});

describe('findById', () => {
  it('return instance of Resolver', () => {
    expect(findByIdResolver).toBeInstanceOf(Resolver);
  });

  it('check args', () => {
    expect(findByIdResolver.hasArg('id')).toBeTruthy();
  });

  it('resolve', () => {
    findByIdResolver.resolve({ args: { id: '4554' }, context: { elasticClient } }).then(res => {
        console.log(res); // eslint-disable-line
    });
  });

  it('toDottedList()', () => {
    expect(FindById.toDottedList({ a: { b: true, c: { e: true } }, d: true })).toEqual([
      'a.b',
      'a.c.e',
      'd',
    ]);
    expect(FindById.toDottedList({})).toEqual(true);
  });
});
