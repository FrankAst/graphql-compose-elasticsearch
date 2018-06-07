/* @flow */

import { Resolver, TypeComposer, InputTypeComposer } from 'graphql-compose';
import type { ResolveParams } from 'graphql-compose';
import type { FieldsMapByElasticType } from '../mappingConverter';
import ElasticApiParser from '../ElasticApiParser';
import { getInsertSuggestOutputTC } from '../types/InsertSuggestOutputTC';
import { getTypeName, getOrSetType, desc } from '../utils';

export type ElasticResolverOpts = {
  prefix?: ?string,
  elasticIndex: string,
  elasticType: string,
  elasticClient: Object,
};

export default function createInsertSuggestResolver(
  fieldMap: FieldsMapByElasticType,
  sourceTC: TypeComposer,
  opts: ElasticResolverOpts
): Resolver {
  if (!fieldMap || !fieldMap._all) {
    throw new Error(
      'First arg for Resolver insertSuggest() should be fieldMap of FieldsMapByElasticType type.'
    );
  }

  if (!sourceTC || sourceTC.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver insertSuggest() should be instance of TypeComposer.');
  }

  if (!fieldMap.completion) {
    throw new Error('Mapping for Resolver insertSuggest() should contain `completion` field.');
  }

  // const suggestField = Object.keys(fieldMap.completion)[0];

  const prefix = opts.prefix || 'Es';
  const parser = new ElasticApiParser({
    elasticClient: opts.elasticClient,
    prefix,
  });

  const insertSuggestFC = parser.generateFieldConfig('create', {
    index: opts.elasticIndex,
    type: opts.elasticType,
  });

  const argsConfigMap = {
    record: getRecordITC(fieldMap).getTypeAsRequired(),
  };

  const type = getInsertSuggestOutputTC({ prefix, fieldMap, sourceTC });

  return new Resolver({
    type,
    name: 'insertSuggest',
    kind: 'mutation',
    args: argsConfigMap,
    resolve: async (rp: ResolveParams<*, *>) => {
      const { source, args, context, info } = rp;
      args.body = {
        // doc: {
        ...args.record,
        // },
      };
      delete args.record;

      const res = await insertSuggestFC.resolve(source, args, context, info);
      console.log(res);
      return res;
    },
  });
}

export function getRecordITC(fieldMap: FieldsMapByElasticType): InputTypeComposer {
  const name = getTypeName('Record', {});
  const description = desc(`The record from Elastic Search`);
  // const fields = fieldMap._all;
  // const suggestField = Object.keys(fieldMap.completion)[0];
  // delete fields[suggestField];
  // console.log(fields);
  return getOrSetType(name, () =>
    InputTypeComposer.create({
      name,
      description,
      fields: { ...fieldMap._all },
    })
  );
}
