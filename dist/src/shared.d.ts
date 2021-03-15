import * as firestore from '@firebase/firestore-types'
export interface OperationsType {
  set: (target: Record<string, any>, key: string | number, value: any) => any
  add: (map: Map<string, any>, key: string, data: firestore.DocumentData) => any
  remove: (map: Map<string, any>, key: string) => any
}
export declare type ResetOption = boolean | (() => any)
export declare type TODO = any
/**
 * Walks a path inside an object
 * walkGet({ a: { b: true }}), 'a.b') -> true
 * @param obj
 * @param path
 */
export declare function walkGet(obj: Record<string, any>, path: string): any
/**
 * Deeply set a property in an object with a string path
 * walkSet({ a: { b: true }}, 'a.b', false)
 * @param obj
 * @param path
 * @param value
 * @returns an array with the element that was replaced or the value that was set
 */
export declare function walkSet<T>(
  obj: Record<string, any>,
  path: string | number,
  value: T
): T | T[]
/**
 * Checks if a variable is an object
 * @param o
 */
export declare function isObject(o: any): o is object
/**
 * Checks if a variable is a Date
 * @param o
 */
export declare function isTimestamp(o: any): o is Date
/**
 * Checks if a variable is a Firestore Document Reference
 * @param o
 */
export declare function isDocumentRef(o: any): o is firestore.DocumentReference
/**
 * Wraps a function so it gets called only once
 * @param fn Function to be called once
 * @param argFn Function to compute the argument passed to fn
 */
export declare function callOnceWithArg<T, K>(
  fn: (arg: T) => K,
  argFn: () => T
): () => K | undefined
//# sourceMappingURL=shared.d.ts.map