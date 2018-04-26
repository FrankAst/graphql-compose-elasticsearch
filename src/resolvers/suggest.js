// https://www.elastic.co/blog/you-complete-me
// https://qbox.io/blog/multi-field-partial-word-autocomplete-in-elasticsearch-using-ngrams
// https://qbox.io/blog/quick-and-dirty-autocomplete-with-elasticsearch-completion-suggest
// https://engineering.skroutz.gr/blog/implementing-a-fuzzy-suggestion-mechanism/
// https://gist.github.com/justinvw/5025854

/* @flow */

import { Resolver, TypeComposer } from 'graphql-compose';
import type { ResolveParams } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getFindByIdOutputTC } from '../types/FindByIdOutput';

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

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver suggest() should be instance of TypeComposer.');
  }

  const prefix = opts.prefix || 'Es';

  // console.log(fieldMap);

  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const suggestFC = parser.generateFieldConfig('search', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  // console.log('FC: ', suggestFC);

  // const argsConfigMap = {
  //   id: 'String!',
  // };

  const type = getFindByIdOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type,
    name: 'suggest',
    kind: 'query',
    // args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      console.log('resolver worked', rp);
      // const { source, args, context, info } = rp;
      //
      // if (!args.id) {
      //   throw new Error(`Missed 'id' argument!`);
      // }
      //
      // const res = await suggestFC.resolve(source, args, context, info);
      // const { _index, _type, _id, _version, _source } = res || {};
      //
      // return {
      //   _index,
      //   _type,
      //   _id,
      //   _version,
      //   ..._source,
      // };
    },
  });
}
