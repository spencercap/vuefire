import * as database from '@firebase/database-types'
import { RTDBSerializer } from './utils'
import { OperationsType, ResetOption } from '../shared'
import { Ref } from 'vue-demi'
export interface RTDBOptions {
  reset?: ResetOption
  serialize?: RTDBSerializer
  wait?: boolean
}
declare const DEFAULT_OPTIONS: Required<RTDBOptions>
export { DEFAULT_OPTIONS as rtdbOptions }
interface CommonBindOptionsParameter {
  target: Ref<any>
  resolve: (value: any) => void
  reject: (error: any) => void
  ops: OperationsType
}
interface BindAsObjectParameter extends CommonBindOptionsParameter {
  document: database.Reference | database.Query
}
/**
 * Binds a RTDB reference as an object
 * @param param0
 * @param options
 * @returns a function to be called to stop listeninng for changes
 */
export declare function rtdbBindAsObject(
  { target, document, resolve, reject, ops }: BindAsObjectParameter,
  extraOptions?: RTDBOptions
): (reset?: ResetOption | undefined) => void
interface BindAsArrayParameter extends CommonBindOptionsParameter {
  collection: database.Reference | database.Query
}
/**
 * Binds a RTDB reference or query as an array
 * @param param0
 * @param options
 * @returns a function to be called to stop listeninng for changes
 */
export declare function rtdbBindAsArray(
  { target, collection, resolve, reject, ops }: BindAsArrayParameter,
  extraOptions?: RTDBOptions
): (reset?: ResetOption | undefined) => void
//# sourceMappingURL=index.d.ts.map
