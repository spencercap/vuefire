import { RTDBOptions } from '../core'
import * as database from '@firebase/database-types'
import { App, Ref } from 'vue-demi'
interface PluginOptions {
  bindName?: string
  unbindName?: string
  serialize?: RTDBOptions['serialize']
  reset?: RTDBOptions['reset']
  wait?: RTDBOptions['wait']
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
    $rtdbBind(
      name: string,
      reference: database.Reference | database.Query,
      options?: RTDBOptions
    ): Promise<database.DataSnapshot>
    /**
     * Unbinds a bound reference
     */
    $rtdbUnbind: (name: string, reset?: RTDBOptions['reset']) => void
    /**
     * Bound firestore references
     */
    $firebaseRefs: Readonly<Record<string, database.Reference>>
  }
  interface ComponentCustomOptions {
    /**
     * Calls `$bind` at created
     */
    firebase?: FirebaseOption
  }
}
declare type VueFirebaseObject = Record<
  string,
  database.Query | database.Reference
>
declare type FirebaseOption = VueFirebaseObject | (() => VueFirebaseObject)
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
export declare function bind(
  target: Ref,
  reference: database.Reference | database.Query,
  options?: RTDBOptions
): Promise<unknown>
export declare const unbind: (target: Ref, reset?: RTDBOptions['reset']) => void
export {}
//# sourceMappingURL=rtdb.d.ts.map
