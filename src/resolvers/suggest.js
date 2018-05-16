// https://www.elastic.co/blog/you-complete-me
// https://qbox.io/blog/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams
// https://qbox.io/blog/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest
// https://engineering.skroutz.gr/blog/implementing-a-fuzzy-suggestion-mechanism/
// https://gist.github.com/justinvw/5025854
// http://rea.tech/implementing-autosuggest-in-elasticsearch/
// https://stackoverflow.com/questions/48304499/elasticsearch-completion-suggester-not-working-with-whitespace-analyzer

/* @flow */

import { Resolver, TypeComposer } from 'graphql-compose';
import type { ResolveParams } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getSuggestOutputTC } from '../types/SuggestOutputTC';

export type ElasticResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createSuggestResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticResolverOpts
): Resolver {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver suggest() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!fieldMap.completion) {
    throw new Error('Mapping for Resolver suggest() should contain `completion` field.');
  }

  const suggestField = Object.keys(fieldMap.completion)[0];

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver suggest() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const suggestFC = parser.generateFieldConfig('suggest', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const type = getSuggestOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type: [type],
    name: 'suggest',
    kind: 'query',
    args: {
      text: 'String!',
    },
    resolve: async (rp: ResolveParams<*, *>) => {
      const { source, args, context, info } = rp;
      args.body = { suggest: { text: args.text, completion: { field: suggestField } } };
      delete args.text;

      const response = [];
      const res = await suggestFC.resolve(source, args, context, info);
      res.suggest[0].options.forEach(i => {
        const { _index, _type, _id, _score, _source } = i || {};
        response.push({ _index, _type, _id, _score, ..._source });
      });
      return response;
    },
  });
}
