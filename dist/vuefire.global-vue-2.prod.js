/*!
 * vuefire v3.0.0-alpha.3
 * (c) 2021 Eduardo San Martin Morote
 * @license MIT
 */
var Vuefire = (function (e, t) {
  'use strict'
  function n(e, t) {
    return t.split('.').reduce((e, t) => e[t], e)
  }
  function o(e, t, n) {
    const o = ('' + t).split('.'),
      i = o.pop(),
      r = o.reduce((e, t) => e[t], e)
    return Array.isArray(r) ? r.splice(Number(i), 1, n) : (r[i] = n)
  }
  function i(e) {
    return e && 'object' == typeof e
  }
  function r(e) {
    return e && e.onSnapshot
  }
  function s(e, t) {
    for (let n = 0; n < e.length; n++) if (e[n]['.key'] === t) return n
    return -1
  }
  const c = {
    reset: !0,
    serialize: function (e) {
      const t = e.val(),
        n = i(t) ? t : Object.defineProperty({}, '.value', { value: t })
      return Object.defineProperty(n, '.key', { value: e.key }), n
    },
    wait: !1,
  }
  function u(e, t, n) {
    const o = [{}, {}],
      s = Object.keys(n).reduce((e, t) => {
        const o = n[t]
        return (e[o.path] = o.data()), e
      }, {})
    return (
      (function e(t, n, o, c) {
        n = n || {}
        const [u, f] = c
        Object.getOwnPropertyNames(t).forEach((e) => {
          const n = Object.getOwnPropertyDescriptor(t, e)
          n && !n.enumerable && Object.defineProperty(u, e, n)
        })
        for (const c in t) {
          const a = t[c]
          if (
            null == a ||
            a instanceof Date ||
            a.toDate ||
            (a.longitude && a.latitude)
          )
            u[c] = a
          else if (r(a))
            (u[c] =
              'object' == typeof n && c in n && 'string' != typeof n[c]
                ? n[c]
                : a.path),
              (f[o + c] = a)
          else if (Array.isArray(a)) {
            u[c] = Array(a.length)
            for (let e = 0; e < a.length; e++) {
              const t = a[e]
              t && t.path in s && (u[c][e] = s[t.path])
            }
            e(a, n[c] || u[c], o + c + '.', [u[c], f])
          } else
            i(a)
              ? ((u[c] = {}), e(a, n[c], o + c + '.', [u[c], f]))
              : (u[c] = a)
        }
      })(e, t, '', o),
      o
    )
  }
  const f = {
    maxRefDepth: 2,
    reset: !0,
    serialize: function (e) {
      return Object.defineProperty(e.data() || {}, 'id', { value: e.id })
    },
    wait: !1,
  }
  function a(e) {
    for (const t in e) e[t].unsub()
  }
  function l(e, t, o, i, r, s, c, f) {
    const [a, l] = u(e.serialize(i), n(t, o), r)
    s.set(t, o, a), h(e, t, o, r, l, s, c, f)
  }
  function d({ ref: e, target: t, path: n, depth: o, resolve: i, ops: r }, s) {
    const c = Object.create(null),
      u = e.onSnapshot((e) => {
        e.exists ? l(s, t, n, e, c, r, o, i) : (r.set(t, n, null), i())
      })
    return () => {
      u(), a(c)
    }
  }
  function h(e, t, o, i, r, s, c, u) {
    const f = Object.keys(r)
    if (
      (Object.keys(i)
        .filter((e) => f.indexOf(e) < 0)
        .forEach((e) => {
          i[e].unsub(), delete i[e]
        }),
      !f.length || ++c > e.maxRefDepth)
    )
      return u(o)
    let a = 0
    const l = f.length,
      h = Object.create(null)
    function p(e) {
      e in h && ++a >= l && u(o)
    }
    f.forEach((u) => {
      const f = i[u],
        a = r[u],
        l = `${o}.${u}`
      if (((h[l] = !0), f)) {
        if (f.path === a.path) return
        f.unsub()
      }
      i[u] = {
        data: () => n(t, l),
        unsub: d(
          {
            ref: a,
            target: t,
            path: l,
            depth: c,
            ops: s,
            resolve: p.bind(null, l),
          },
          e
        ),
        path: a.path,
      }
    })
  }
  function p(e, n, o, i, r, s = f) {
    const c = Object.assign({}, f, s),
      l = 'value'
    c.wait || o.set(e, l, [])
    let d = t.ref(c.wait ? [] : e[l])
    const p = i
    let b
    const g = [],
      m = {
        added: ({ newIndex: e, doc: n }) => {
          g.splice(e, 0, Object.create(null))
          const r = g[e],
            [s, f] = u(c.serialize(n), void 0, r)
          o.add(t.unref(d), e, s),
            h(c, d, `value.${e}`, r, f, o, 0, i.bind(null, n))
        },
        modified: ({ oldIndex: e, newIndex: n, doc: r }) => {
          const s = t.unref(d),
            f = g[e],
            a = s[e],
            [l, p] = u(c.serialize(r), a, f)
          g.splice(n, 0, f),
            o.remove(s, e),
            o.add(s, n, l),
            h(c, d, `value.${n}`, f, p, o, 0, i)
        },
        removed: ({ oldIndex: e }) => {
          const n = t.unref(d)
          o.remove(n, e), a(g.splice(e, 1)[0])
        },
      },
      y = n.onSnapshot((n) => {
        const r =
          'function' == typeof n.docChanges ? n.docChanges() : n.docChanges
        if (!b && r.length) {
          b = !0
          let n = 0
          const s = r.length,
            u = Object.create(null)
          for (let e = 0; e < s; e++) u[r[e].doc.id] = !0
          i = ({ id: r }) => {
            r in u &&
              ++n >= s &&
              (c.wait && o.set(e, l, t.unref(d)), p(t.unref(d)), (i = () => {}))
          }
        }
        r.forEach((e) => {
          m[e.type](e)
        }),
          r.length || (c.wait && o.set(e, l, t.unref(d)), i(t.unref(d)))
      }, r)
    return (t) => {
      if ((y(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : []
        o.set(e, l, n)
      }
      g.forEach(a)
    }
  }
  function b(e, t, o, i, r, s = f) {
    const c = Object.assign({}, f, s),
      u = 'value',
      d = Object.create(null)
    i = (function (e, t) {
      let n = !1
      return () => {
        if (!n) return (n = !0), e(t())
      }
    })(i, () => n(e, u))
    const h = t.onSnapshot((t) => {
      t.exists ? l(c, e, u, t, d, o, 0, i) : (o.set(e, u, null), i(null))
    }, r)
    return (t) => {
      if ((h(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : null
        o.set(e, u, n)
      }
      a(d)
    }
  }
  const g = {
    set: (e, t, n) => o(e, t, n),
    add: (e, t, n) => e.splice(t, 0, n),
    remove: (e, t) => e.splice(t, 1),
  }
  function m(e, n, o, i, r) {
    return new Promise((u, f) => {
      let a
      ;(a = Array.isArray(e.value)
        ? (function (
            { target: e, collection: n, resolve: o, reject: i, ops: r },
            u = c
          ) {
            const f = Object.assign({}, c, u),
              a = 'value'
            f.wait || r.set(e, a, [])
            let l = t.ref(f.wait ? [] : e[a])
            const d = n.on('child_added', (e, n) => {
                const o = t.unref(l),
                  i = n ? s(o, n) + 1 : 0
                r.add(o, i, f.serialize(e))
              }),
              h = n.on('child_removed', (e) => {
                const n = t.unref(l)
                r.remove(n, s(n, e.key))
              }),
              p = n.on('child_changed', (e) => {
                const n = t.unref(l)
                r.set(n, s(n, e.key), f.serialize(e))
              }),
              b = n.on('child_moved', (e, n) => {
                const o = t.unref(l),
                  i = s(o, e.key),
                  c = r.remove(o, i)[0],
                  u = n ? s(o, n) + 1 : 0
                r.add(o, u, c)
              })
            return (
              n.once(
                'value',
                (n) => {
                  const i = t.unref(l)
                  f.wait && r.set(e, a, i), o(n)
                },
                i
              ),
              (t) => {
                if (
                  (n.off('child_added', d),
                  n.off('child_changed', p),
                  n.off('child_removed', h),
                  n.off('child_moved', b),
                  !1 !== t)
                ) {
                  const n = 'function' == typeof t ? t() : []
                  r.set(e, a, n)
                }
              }
            )
          })({ target: e, collection: o, resolve: u, reject: f, ops: g }, r)
        : (function (
            { target: e, document: t, resolve: n, reject: o, ops: i },
            r = c
          ) {
            const s = 'value',
              u = Object.assign({}, c, r),
              f = t.on('value', (t) => {
                i.set(e, s, u.serialize(t))
              })
            return (
              t.once('value', n, o),
              (n) => {
                if ((t.off('value', f), !1 !== n)) {
                  const t = 'function' == typeof n ? n() : null
                  i.set(e, s, t)
                }
              }
            )
          })({ target: e, document: o, resolve: u, reject: f, ops: g }, r)),
        (i[n] = a)
    })
  }
  function y(e, t, n) {
    t && t[e] && (t[e](n), delete t[e])
  }
  const v = {
      bindName: '$rtdbBind',
      unbindName: '$rtdbUnbind',
      serialize: c.serialize,
      reset: c.reset,
      wait: c.wait,
    },
    j = new WeakMap()
  const O = (e, t) => y('', j.get(e), t),
    w = {
      set: (e, t, n) => o(e, t, n),
      add: (e, t, n) => e.splice(t, 0, n),
      remove: (e, t) => e.splice(t, 1),
    }
  function $(e, t, n) {
    let o
    return [
      new Promise((i, r) => {
        o = ('where' in t ? p : b)(e, t, w, i, r, n)
      }),
      o,
    ]
  }
  function P(e, t, n) {
    t && t[e] && (t[e](n), delete t[e])
  }
  const z = {
      bindName: '$bind',
      unbindName: '$unbind',
      serialize: f.serialize,
      reset: f.reset,
      wait: f.wait,
    },
    R = new WeakMap()
  return (
    (e.bind = function (e, n, o) {
      const [i, r] = $(e, n, o)
      return (
        R.set(e, { '': r }),
        t.getCurrentInstance() &&
          t.onBeforeUnmount(() => {
            r(o && o.reset)
          }),
        i
      )
    }),
    (e.firestorePlugin = function (e, n = z) {
      const o = Object.assign({}, z, n),
        { bindName: i, unbindName: r } = o,
        s = t.isVue3 ? e.config.globalProperties : e.prototype
      ;(s[r] = function (e, t) {
        P(e, R.get(this), t), delete this.$firestoreRefs[e]
      }),
        (s[i] = function (e, n, i) {
          const r = Object.assign({}, o, i),
            s = t.toRef(this.$data, e)
          let c = R.get(this)
          c
            ? c[e] &&
              c[e](r.wait ? 'function' == typeof r.reset && r.reset : r.reset)
            : R.set(this, (c = {}))
          const [u, f] = $(s, n, r)
          return (c[e] = f), (this.$firestoreRefs[e] = n), u
        }),
        e.mixin({
          beforeCreate() {
            this.$firestoreRefs = Object.create(null)
          },
          created() {
            const { firestore: e } = this.$options,
              t = 'function' == typeof e ? e.call(this) : e
            if (t) for (const e in t) this[i](e, t[e], o)
          },
          beforeUnmount() {
            const e = R.get(this)
            if (e) for (const t in e) e[t]()
            this.$firestoreRefs = null
          },
        })
    }),
    (e.internalUnbind = P),
    (e.ops = w),
    (e.rtdbBind = function (e, n, o) {
      const i = {}
      j.set(e, i)
      const r = m(e, '', n, i, o)
      return (
        t.getCurrentInstance() &&
          t.onBeforeUnmount(() => {
            O(e, o && o.reset)
          }),
        r
      )
    }),
    (e.rtdbPlugin = function (e, n = v) {
      const o = Object.assign({}, v, n),
        { bindName: i, unbindName: r } = o,
        s = t.isVue3 ? e.config.globalProperties : e.prototype
      ;(s[r] = function (e, t) {
        y(e, j.get(this), t), delete this.$firebaseRefs[e]
      }),
        (s[i] = function (e, n, i) {
          const r = Object.assign({}, o, i),
            s = t.toRef(this.$data, e)
          let c = j.get(this)
          c
            ? c[e] &&
              c[e](r.wait ? 'function' == typeof r.reset && r.reset : r.reset)
            : j.set(this, (c = {}))
          const u = m(s, e, n, c, r)
          return (this.$firebaseRefs[e] = n.ref), u
        }),
        e.mixin({
          beforeCreate() {
            this.$firebaseRefs = Object.create(null)
          },
          created() {
            let e = this.$options.firebase
            if (('function' == typeof e && (e = e.call(this)), e))
              for (const t in e) this[i](t, e[t], o)
          },
          beforeUnmount() {
            const e = j.get(this)
            if (e) for (const t in e) e[t]()
            this.$firebaseRefs = null
          },
        })
    }),
    (e.rtdbUnbind = O),
    (e.unbind = (e, t) => {
      P('', R.get(e), t)
    }),
    (e.useFirestore = function (e, n) {
      const o = t.ref('where' in e ? null : [])
      let i
      const r = new Promise((t, r) => {
        i = ('where' in e ? p : b)(o, e, w, t, r, n)
      })
      return t.getCurrentInstance() && t.onUnmounted(() => i()), [o, r, i]
    }),
    Object.defineProperty(e, '__esModule', { value: !0 }),
    e
  )
})({}, VueDemi)
