import {
  bindCollection,
  bindDocument,
  FirestoreOptions,
  OperationsType,
} from '../core'
import * as firestore from '@firebase/firestore-types'
import { App, Ref } from 'vue-demi'
export declare const ops: OperationsType
declare type UnbindType = ReturnType<
  typeof bindCollection | typeof bindDocument
>
export declare function internalUnbind(
  key: string,
  unbinds:
    | Record<string, ReturnType<typeof bindCollection | typeof bindDocument>>
    | undefined,
  reset?: FirestoreOptions['reset']
): void
interface PluginOptions {
  bindName?: string
  unbindName?: string
  serialize?: FirestoreOptions['serialize']
  reset?: FirestoreOptions['reset']
  wait?: FirestoreOptions['wait']
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Binds a reference
     *
     * @param name
     * @param reference
     * @param options
     */
    $bind(
      name: string,
      reference: firestore.Query | firestore.CollectionReference,
      options?: FirestoreOptions
    ): Promise<firestore.DocumentData[]>
    $bind(
      name: string,
      reference: firestore.DocumentReference,
      options?: FirestoreOptions
    ): Promise<firestore.DocumentData>
    /**
     * Unbinds a bound reference
     */
    $unbind: (name: string, reset?: FirestoreOptions['reset']) => void
    /**
     * Bound firestore references
     */
    $firestoreRefs: Readonly<
      Record<
        string,
        firestore.DocumentReference | firestore.CollectionReference
      >
    >
  }
  interface ComponentCustomOptions {
    /**
     * Calls `$bind` at created
     */
    firestore?: FirestoreOption
  }
}
declare type VueFirestoreObject = Record<
  string,
  firestore.DocumentReference | firestore.Query | firestore.CollectionReference
>
declare type FirestoreOption = VueFirestoreObject | (() => VueFirestoreObject)
/**
 * Install this plugin to add `$bind` and `$unbind` functions. Note this plugin
 * is not necessary if you exclusively use the Composition API
 *
 * @param app
 * @param pluginOptions
 */
export declare const firestorePlugin: (
  app: App,
  pluginOptions?: PluginOptions
) => void
export declare function bind(
  target: Ref,
  docOrCollectionRef:
    | firestore.CollectionReference
    | firestore.Query
    | firestore.DocumentReference,
  options?: FirestoreOptions
): Promise<any>
export declare function useFirestore<T>(
  docRef: firestore.DocumentReference<T>,
  options?: FirestoreOptions
): [Ref<T | null>, Promise<T | null>, UnbindType]
export declare function useFirestore<T>(
  collectionRef: firestore.Query<T> | firestore.CollectionReference<T>,
  options?: FirestoreOptions
): [Ref<T[]>, Promise<T[]>, UnbindType]
export declare const unbind: (
  target: Ref,
  reset?: FirestoreOptions['reset']
) => void
export {}
//# sourceMappingURL=firestore.d.ts.map
