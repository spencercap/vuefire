import { App } from 'vue-demi'
import * as database from '@firebase/database-types'
import * as firestore from '@firebase/firestore-types'
import { Ref } from 'vue-demi'

/**
 * Convert firebase RTDB snapshot into a bindable data record.
 *
 * @param snapshot
 * @return
 */
declare function createRecordFromRTDBSnapshot(
  snapshot: database.DataSnapshot
): any

declare function createSnapshot(doc: firestore.DocumentSnapshot): TODO

export declare function firestoreBind(
  target: Ref,
  docOrCollectionRef:
    | firestore.CollectionReference
    | firestore.Query
    | firestore.DocumentReference,
  options?: FirestoreOptions
): Promise<any>

declare interface FirestoreOptions {
  maxRefDepth?: number
  reset?: boolean | (() => any)
  serialize?: FirestoreSerializer
  wait?: boolean
}

/**
 * Install this plugin to add `$bind` and `$unbind` functions. Note this plugin
 * is not necessary if you exclusively use the Composition API
 *
 * @param app
 * @param pluginOptions
 */
export declare const firestorePlugin: (
  app: App,
  pluginOptions?: PluginOptions_2
) => void

declare type FirestoreSerializer = typeof createSnapshot

export declare const firestoreUnbind: (
  target: Ref,
  reset?: FirestoreOptions['reset']
) => void

declare interface PluginOptions {
  bindName?: string
  unbindName?: string
  serialize?: RTDBOptions['serialize']
  reset?: RTDBOptions['reset']
  wait?: RTDBOptions['wait']
}

declare interface PluginOptions_2 {
  bindName?: string
  unbindName?: string
  serialize?: FirestoreOptions['serialize']
  reset?: FirestoreOptions['reset']
  wait?: FirestoreOptions['wait']
}

declare type ResetOption = boolean | (() => any)

export declare function rtdbBind(
  target: Ref,
  reference: database.Reference | database.Query,
  options?: RTDBOptions
): Promise<unknown>

declare interface RTDBOptions {
  reset?: ResetOption
  serialize?: RTDBSerializer
  wait?: boolean
}

/**
 * Install this plugin if you want to add `$bind` and `$unbind` functions. Note
 * this plugin is not necessary if you exclusively use the Composition API.
 *
 * @param app
 * @param pluginOptions
 */
export declare const rtdbPlugin: (
  app: App,
  pluginOptions?: PluginOptions
) => void

declare type RTDBSerializer = typeof createRecordFromRTDBSnapshot

export declare const rtdbUnbind: (
  target: Ref,
  reset?: RTDBOptions['reset']
) => void

declare type TODO = any

export {}