/* @flow */

import elasticsearch from 'elasticsearch';
import seedData from './seedData.json';

export const elsaticClient = new elasticsearch.Client({
  host: 'http://localhost:9200',
  apiVersion: '5.0',
  log: 'trace',
});

seedData.forEach(doc => {
  console.log(`================>`, doc);
  // elsaticClient
  //   .suggest({
  //     index: 'university',
  //     type: 'university',
  //     body: {
  //       text: doc.title,
  //       mySuggestion: {
  //         completion: 'title_suggest',
  //       },
  //     },
  //   })
  //   .then(() => {
  //     console.log(`${doc.id} successfully seeded!`);
  //   });
});
