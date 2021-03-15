import * as database from '@firebase/database-types'
/**
 * Convert firebase RTDB snapshot into a bindable data record.
 *
 * @param snapshot
 * @return
 */
export declare function createRecordFromRTDBSnapshot(
  snapshot: database.DataSnapshot
): any
export declare type RTDBSerializer = typeof createRecordFromRTDBSnapshot
/**
 * Find the index for an object with given key.
 *
 * @param array
 * @param key
 * @return the index where the key was found
 */
export declare function indexForKey(
  array: any[],
  key: string | null | number
): number
//# sourceMappingURL=utils.d.ts.map