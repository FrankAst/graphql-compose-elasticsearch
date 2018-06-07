/* @flow */

import { TypeComposer } from 'graphql-compose';
import { getTypeName, getOrSetType } from '../utils';
import type { FieldsMapByElasticType } from '../mappingConverter';

export type SuggestOptsT = {
  prefix?: string,
  postfix?: string,
  fieldMap?: FieldsMapByElasticType,
  sourceTC: TypeComposer,
};

export function getInsertSuggestOutputTC(opts: SuggestOptsT): TypeComposer {
  const name = getTypeName('SuggestOutput', opts);
  const { sourceTC } = opts || {};
  const sourceFields = sourceTC.getFields();
  delete sourceFields.title_suggest;
  return getOrSetType(name, () =>
    TypeComposer.create({
      name,
      fields: {
        _index: 'String',
        _type: 'String',
        _id: 'String',
        _score: 'Float',
        title_suggest: 'JSON',
        ...sourceFields,
      },
    })
  );
}

// {
// 	"took": 281,
// 	"timed_out": false,
// 	"_shards": {
// 		"total": 5,
// 		"successful": 5,
// 		"failed": 0
// 	},
// 	"hits": {
// 		"total": 0,
// 		"max_score": 0.0,
// 		"hits": []
// 	},
// 	"suggest": {
// 		"university_suggest": [{
// 					"text": "ii",
// 					"offset": 0,
// 					"length": 2,
// 					"options": [{
// 						"text": "IITU",
// 						"_index": "university",
// 						"_type": "university",
// 						"_id": "1",
// 						"_score": 50.0,
// 						"_source": {
// 							"title": "Международный университет информационных технологий",
// 							"title_suggest": [{
// 								"input": "МУИТ",
// 								"weight": 50
// 							}, {
// 								"input": "IITU",
// 								"weight": 50
// 							}, {
// 								"input": "Международный университет информационных технологий",
// 								"weight": 50
// 							}]
// 						}
// 					}]
