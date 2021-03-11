import * as firestore from '@firebase/firestore-types'
import { TODO } from '../shared'
export declare type FirestoreReference =
  | firestore.Query
  | firestore.DocumentReference
  | firestore.CollectionReference
export declare function createSnapshot(doc: firestore.DocumentSnapshot): TODO
export declare type FirestoreSerializer = typeof createSnapshot
export declare function extractRefs(
  doc: firestore.DocumentData,
  oldDoc: firestore.DocumentData | void,
  subs: Record<
    string,
    {
      path: string
      data: () => firestore.DocumentData | null
    }
  >
): [firestore.DocumentData, Record<string, firestore.DocumentReference>]
//# sourceMappingURL=utils.d.ts.map
