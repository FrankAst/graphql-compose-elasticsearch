/* @flow */

import { graphql } from 'graphql-compose';
import { elasticClient } from './';
import { composeWithElastic, elasticApiFieldConfig } from '../../src'; // from 'graphql-compose-elasticsearch';

const { GraphQLSchema, GraphQLObjectType } = graphql;

export const universityMapping = {
  title: { type: 'text' },
  title_suggest: {
    type: 'completion',
    analyzer: 'simple',
    preserve_separators: true,
    preserve_position_increments: true,
    max_input_length: 50,
  },
};

export const UniversityEsTC = composeWithElastic({
  graphqlTypeName: 'UniversityEsTC',
  elasticIndex: 'university',
  elasticType: 'university',
  elasticMapping: {
    properties: universityMapping,
  },
  elasticClient,
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      search: UniversityEsTC.getResolver('search'),
      searchConnection: UniversityEsTC.getResolver('searchConnection'),
      elastic: elasticApiFieldConfig({
        host: 'http://localhost:9200',
        apiVersion: '5.0',
        log: 'trace',
      }),
    },
  }),
});

export default schema;
