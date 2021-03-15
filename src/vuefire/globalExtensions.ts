// // import {
// // 	NavigationGuardWithThis,
// // 	NavigationGuard,
// // 	RouteLocationNormalizedLoaded,
// // } from './types'
// // import { Router } from './router'

// declare module '@vue/runtime-core' {
// 	export interface ComponentCustomProperties {
// 		/**
// 		 * Binds a reference
// 		 *
// 		 * @param name
// 		 * @param reference
// 		 * @param options
// 		 */
// 		$bind(
// 			name: string,
// 			reference: firestore.Query | firestore.CollectionReference,
// 			options?: FirestoreOptions
// 		): Promise<firestore.DocumentData[]>
// 		$bind(
// 			name: string,
// 			reference: firestore.DocumentReference,
// 			options?: FirestoreOptions
// 		): Promise<firestore.DocumentData>

// 		/**
// 		 * Unbinds a bound reference
// 		 */
// 		$unbind: (name: string, reset?: FirestoreOptions['reset']) => void

// 		/**
// 		 * Bound firestore references
// 		 */
// 		$firestoreRefs: Readonly<
// 			Record<
// 				string,
// 				firestore.DocumentReference | firestore.CollectionReference
// 			>
// 		>
// 		// _firestoreSources: Readonly<
// 		//   Record<string, firestore.CollectionReference | firestore.Query | firestore.DocumentReference>
// 		// >
// 		/**
// 		 * Existing unbind functions that get automatically called when the component is unmounted
// 		 * @internal
// 		 */
// 		// _firestoreUnbinds: Readonly<
// 		//   Record<string, ReturnType<typeof bindCollection | typeof bindDocument>>
// 		// >
// 	}
// 	export interface ComponentCustomOptions {
// 		/**
// 		 * Calls `$bind` at created
// 		 */
// 		firestore?: FirestoreOption
// 	}
// }

// // declare module '@vue/runtime-core' {
// // 	export interface ComponentCustomOptions {
// // 		/**
// // 		 * Guard called when the router is navigating to the route that is rendering
// // 		 * this component from a different route. Differently from `beforeRouteUpdate`
// // 		 * and `beforeRouteLeave`, `beforeRouteEnter` does not have access to the
// // 		 * component instance through `this` because it triggers before the component
// // 		 * is even mounted.
// // 		 *
// // 		 * @param to - RouteLocationRaw we are navigating to
// // 		 * @param from - RouteLocationRaw we are navigating from
// // 		 * @param next - function to validate, cancel or modify (by redirecting) the
// // 		 * navigation
// // 		 */
// // 		beforeRouteEnter?: NavigationGuardWithThis<undefined>

// // 		/**
// // 		 * Guard called whenever the route that renders this component has changed but
// // 		 * it is reused for the new route. This allows you to guard for changes in
// // 		 * params, the query or the hash.
// // 		 *
// // 		 * @param to - RouteLocationRaw we are navigating to
// // 		 * @param from - RouteLocationRaw we are navigating from
// // 		 * @param next - function to validate, cancel or modify (by redirecting) the
// // 		 * navigation
// // 		 */
// // 		beforeRouteUpdate?: NavigationGuard

// // 		/**
// // 		 * Guard called when the router is navigating away from the current route that
// // 		 * is rendering this component.
// // 		 *
// // 		 * @param to - RouteLocationRaw we are navigating to
// // 		 * @param from - RouteLocationRaw we are navigating from
// // 		 * @param next - function to validate, cancel or modify (by redirecting) the
// // 		 * navigation
// // 		 */
// // 		beforeRouteLeave?: NavigationGuard
// // 	}

// // 	export interface ComponentCustomProperties {
// // 		/**
// // 		 * Normalized current location. See {@link RouteLocationNormalizedLoaded}.
// // 		 */
// // 		$route: RouteLocationNormalizedLoaded
// // 		/**
// // 		 * {@link Router} instance used by the application.
// // 		 */
// // 		$router: Router
// // 	}
// // }
