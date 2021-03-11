import { FirestoreSerializer } from './utils'
import { OperationsType } from '../shared'
import * as firestore from '@firebase/firestore-types'
import { Ref } from 'vue-demi'
export interface FirestoreOptions {
  maxRefDepth?: number
  reset?: boolean | (() => any)
  serialize?: FirestoreSerializer
  wait?: boolean
}
declare const DEFAULT_OPTIONS: Required<FirestoreOptions>
export { DEFAULT_OPTIONS as firestoreOptions }
interface CommonBindOptionsParameter {
  target: Ref<any>
  resolve: (value: any) => void
  reject: (error: any) => void
  ops: OperationsType
}
interface BindCollectionParameter extends CommonBindOptionsParameter {
  collection: firestore.CollectionReference | firestore.Query
}
export declare function bindCollection(
  target: BindCollectionParameter['target'],
  collection: BindCollectionParameter['collection'],
  ops: BindCollectionParameter['ops'],
  resolve: BindCollectionParameter['resolve'],
  reject: BindCollectionParameter['reject'],
  extraOptions?: FirestoreOptions
): (reset?: FirestoreOptions['reset']) => void
interface BindDocumentParameter extends CommonBindOptionsParameter {
  document: firestore.DocumentReference
}
/**
 * Binds a Document to a property of vm
 * @param param0
 * @param extraOptions
 */
export declare function bindDocument(
  target: BindDocumentParameter['target'],
  document: BindDocumentParameter['document'],
  ops: BindDocumentParameter['ops'],
  resolve: BindDocumentParameter['resolve'],
  reject: BindDocumentParameter['reject'],
  extraOptions?: FirestoreOptions
): (reset?: FirestoreOptions['reset']) => void
//# sourceMappingURL=index.d.ts.map
