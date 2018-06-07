/* @flow */

import elasticsearch from 'elasticsearch';
import seedData from './seedData.json';

export const elsaticClient = new elasticsearch.Client({
  host: 'http://localhost:9200',
  apiVersion: '5.0',
  log: 'trace',
});

const body = [];
seedData.forEach(row => {
  const { id, ...restData } = row;
  body.push({ index: { _index: 'demo_user', _type: 'demo_user', _id: id } }, restData);
});

elsaticClient
  .bulk({
    index: 'demo_user',
    type: 'demo_user',
    body,
  })
  .then(() => {
    console.log('Data successfully seeded!');
  });
