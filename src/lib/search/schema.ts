// // Schema for search results
// // $lib/search/schema.ts
// import { Document, Charset } from 'flexsearch';

// export function createIndex() {
// 	return new Document({
// 		document: {
// 			id: 'id',
// 			index: [
// 				{
// 					field: 'title',
// 					tokenize: 'forward',
// 					encoder: Charset.Default
// 				},
// 				{
// 					field: 'body',
// 					tokenize: 'bidirectional',
// 					encoder: Charset.Default,
// 					resolution: 3
// 				}
// 			]
// 		},
// 		fastupdate: true,
// 		cache: true,
// 		context: {
// 			resolution: 5,
// 			depth: 3,
// 			bidirectional: true
// 		}
// 	});
// }
