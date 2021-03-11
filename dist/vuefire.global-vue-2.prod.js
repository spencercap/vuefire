/*!
 * vuefire v3.0.0-alpha.2
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
      s = o.reduce((e, t) => e[t], e)
    return Array.isArray(s) ? s.splice(Number(i), 1, n) : (s[i] = n)
  }
  function i(e) {
    return e && 'object' == typeof e
  }
  function s(e) {
    return e && e.onSnapshot
  }
  function r(e, t) {
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
  function f(e, t, n) {
    const o = [{}, {}],
      r = Object.keys(n).reduce((e, t) => {
        const o = n[t]
        return (e[o.path] = o.data()), e
      }, {})
    return (
      (function e(t, n, o, c) {
        n = n || {}
        const [f, a] = c
        Object.getOwnPropertyNames(t).forEach((e) => {
          const n = Object.getOwnPropertyDescriptor(t, e)
          n && !n.enumerable && Object.defineProperty(f, e, n)
        })
        for (const c in t) {
          const u = t[c]
          if (
            null == u ||
            u instanceof Date ||
            u.toDate ||
            (u.longitude && u.latitude)
          )
            f[c] = u
          else if (s(u))
            (f[c] =
              'object' == typeof n && c in n && 'string' != typeof n[c]
                ? n[c]
                : u.path),
              (a[o + c] = u)
          else if (Array.isArray(u)) {
            f[c] = Array(u.length)
            for (let e = 0; e < u.length; e++) {
              const t = u[e]
              t && t.path in r && (f[c][e] = r[t.path])
            }
            e(u, n[c] || f[c], o + c + '.', [f[c], a])
          } else
            i(u)
              ? ((f[c] = {}), e(u, n[c], o + c + '.', [f[c], a]))
              : (f[c] = u)
        }
      })(e, t, '', o),
      o
    )
  }
  const a = {
    maxRefDepth: 2,
    reset: !0,
    serialize: function (e) {
      return Object.defineProperty(e.data() || {}, 'id', { value: e.id })
    },
    wait: !1,
  }
  function u(e) {
    for (const t in e) e[t].unsub()
  }
  function l(e, t, o, i, s, r, c, a) {
    const [u, l] = f(e.serialize(i), n(t, o), s)
    r.set(t, o, u), h(e, t, o, s, l, r, c, a)
  }
  function d({ ref: e, target: t, path: n, depth: o, resolve: i, ops: s }, r) {
    const c = Object.create(null),
      f = e.onSnapshot((e) => {
        e.exists ? l(r, t, n, e, c, s, o, i) : (s.set(t, n, null), i())
      })
    return () => {
      f(), u(c)
    }
  }
  function h(e, t, o, i, s, r, c, f) {
    const a = Object.keys(s)
    if (
      (Object.keys(i)
        .filter((e) => a.indexOf(e) < 0)
        .forEach((e) => {
          i[e].unsub(), delete i[e]
        }),
      !a.length || ++c > e.maxRefDepth)
    )
      return f(o)
    let u = 0
    const l = a.length,
      h = Object.create(null)
    function b(e) {
      e in h && ++u >= l && f(o)
    }
    a.forEach((f) => {
      const a = i[f],
        u = s[f],
        l = `${o}.${f}`
      if (((h[l] = !0), a)) {
        if (a.path === u.path) return
        a.unsub()
      }
      i[f] = {
        data: () => n(t, l),
        unsub: d(
          {
            ref: u,
            target: t,
            path: l,
            depth: c,
            ops: r,
            resolve: b.bind(null, l),
          },
          e
        ),
        path: u.path,
      }
    })
  }
  function b(e, n, o, i, s, r = a) {
    const c = Object.assign({}, a, r),
      l = 'value'
    c.wait || o.set(e, l, [])
    let d = t.ref(c.wait ? [] : e[l])
    const b = i
    let p
    const g = [],
      y = {
        added: ({ newIndex: e, doc: n }) => {
          g.splice(e, 0, Object.create(null))
          const s = g[e],
            [r, a] = f(c.serialize(n), void 0, s)
          o.add(t.unref(d), e, r),
            h(c, d, `value.${e}`, s, a, o, 0, i.bind(null, n))
        },
        modified: ({ oldIndex: e, newIndex: n, doc: s }) => {
          const r = t.unref(d),
            a = g[e],
            u = r[e],
            [l, b] = f(c.serialize(s), u, a)
          g.splice(n, 0, a),
            o.remove(r, e),
            o.add(r, n, l),
            h(c, d, `value.${n}`, a, b, o, 0, i)
        },
        removed: ({ oldIndex: e }) => {
          const n = t.unref(d)
          o.remove(n, e), u(g.splice(e, 1)[0])
        },
      },
      m = n.onSnapshot((n) => {
        const s =
          'function' == typeof n.docChanges ? n.docChanges() : n.docChanges
        if (!p && s.length) {
          p = !0
          let n = 0
          const r = s.length,
            f = Object.create(null)
          for (let e = 0; e < r; e++) f[s[e].doc.id] = !0
          i = ({ id: s }) => {
            s in f &&
              ++n >= r &&
              (c.wait && o.set(e, l, t.unref(d)), b(t.unref(d)), (i = () => {}))
          }
        }
        s.forEach((e) => {
          y[e.type](e)
        }),
          s.length || (c.wait && o.set(e, l, t.unref(d)), i(t.unref(d)))
      }, s)
    return (t) => {
      if ((m(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : []
        o.set(e, l, n)
      }
      g.forEach(u)
    }
  }
  function p(e, t, o, i, s, r = a) {
    const c = Object.assign({}, a, r),
      f = 'value',
      d = Object.create(null)
    i = (function (e, t) {
      let n = !1
      return () => {
        if (!n) return (n = !0), e(t())
      }
    })(i, () => n(e, f))
    const h = t.onSnapshot((t) => {
      t.exists ? l(c, e, f, t, d, o, 0, i) : (o.set(e, f, null), i(null))
    }, s)
    return (t) => {
      if ((h(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : null
        o.set(e, f, n)
      }
      u(d)
    }
  }
  const g = {
    set: (e, t, n) => o(e, t, n),
    add: (e, t, n) => e.splice(t, 0, n),
    remove: (e, t) => e.splice(t, 1),
  }
  function y(e, n, o, i, s) {
    return new Promise((f, a) => {
      let u
      ;(u = Array.isArray(e.value)
        ? (function (
            { target: e, collection: n, resolve: o, reject: i, ops: s },
            f = c
          ) {
            const a = Object.assign({}, c, f),
              u = 'value'
            a.wait || s.set(e, u, [])
            let l = t.ref(a.wait ? [] : e[u])
            const d = n.on('child_added', (e, n) => {
                const o = t.unref(l),
                  i = n ? r(o, n) + 1 : 0
                s.add(o, i, a.serialize(e))
              }),
              h = n.on('child_removed', (e) => {
                const n = t.unref(l)
                s.remove(n, r(n, e.key))
              }),
              b = n.on('child_changed', (e) => {
                const n = t.unref(l)
                s.set(n, r(n, e.key), a.serialize(e))
              }),
              p = n.on('child_moved', (e, n) => {
                const o = t.unref(l),
                  i = r(o, e.key),
                  c = s.remove(o, i)[0],
                  f = n ? r(o, n) + 1 : 0
                s.add(o, f, c)
              })
            return (
              n.once(
                'value',
                (n) => {
                  const i = t.unref(l)
                  a.wait && s.set(e, u, i), o(n)
                },
                i
              ),
              (t) => {
                if (
                  (n.off('child_added', d),
                  n.off('child_changed', b),
                  n.off('child_removed', h),
                  n.off('child_moved', p),
                  !1 !== t)
                ) {
                  const n = 'function' == typeof t ? t() : []
                  s.set(e, u, n)
                }
              }
            )
          })({ target: e, collection: o, resolve: f, reject: a, ops: g }, s)
        : (function (
            { target: e, document: t, resolve: n, reject: o, ops: i },
            s = c
          ) {
            const r = 'value',
              f = Object.assign({}, c, s),
              a = t.on('value', (t) => {
                i.set(e, r, f.serialize(t))
              })
            return (
              t.once('value', n, o),
              (n) => {
                if ((t.off('value', a), !1 !== n)) {
                  const t = 'function' == typeof n ? n() : null
                  i.set(e, r, t)
                }
              }
            )
          })({ target: e, document: o, resolve: f, reject: a, ops: g }, s)),
        (i[n] = u)
    })
  }
  function m(e, t, n) {
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
  const O = (e, t) => m('', j.get(e), t),
    w = {
      set: (e, t, n) => o(e, t, n),
      add: (e, t, n) => e.splice(t, 0, n),
      remove: (e, t) => e.splice(t, 1),
    }
  function $(e, t, n) {
    let o
    return [
      new Promise((i, s) => {
        o = ('where' in t ? b : p)(e, t, w, i, s, n)
      }),
      o,
    ]
  }
  function P(e, t, n) {
    console.log('internalUnbind unbinds', t),
      t && t[e] && (t[e](n), delete t[e])
  }
  const z = {
      bindName: '$bind',
      unbindName: '$unbind',
      serialize: a.serialize,
      reset: a.reset,
      wait: a.wait,
    },
    R = new WeakMap()
  return (
    (e.firestoreBind = function (e, n, o) {
      const [i, s] = $(e, n, o)
      return (
        R.set(e, { '': s }),
        t.getCurrentInstance() &&
          t.onBeforeUnmount(() => {
            s(o && o.reset)
          }),
        i
      )
    }),
    (e.firestorePlugin = function (e, n = z) {
      const o = Object.assign({}, z, n),
        { bindName: i, unbindName: s } = o,
        r = t.isVue3 ? e.config.globalProperties : e.prototype
      ;(r[s] = function (e, t) {
        P(e, R.get(this), t), delete this.$firestoreRefs[e]
      }),
        (r[i] = function (e, n, i) {
          const s = Object.assign({}, o, i),
            r = t.toRef(this.$data, e)
          let c = R.get(this)
          c
            ? c[e] &&
              c[e](s.wait ? 'function' == typeof s.reset && s.reset : s.reset)
            : R.set(this, (c = {}))
          const [f, a] = $(r, n, s)
          return (c[e] = a), (this.$firestoreRefs[e] = n), f
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
    (e.firestoreUnbind = (e, t) => {
      console.log('unbind', R), P('', R.get(e), t)
    }),
    (e.rtdbBind = function (e, n, o) {
      const i = {}
      j.set(e, i)
      const s = y(e, '', n, i, o)
      return (
        t.getCurrentInstance() &&
          t.onBeforeUnmount(() => {
            O(e, o && o.reset)
          }),
        s
      )
    }),
    (e.rtdbPlugin = function (e, n = v) {
      const o = Object.assign({}, v, n),
        { bindName: i, unbindName: s } = o,
        r = t.isVue3 ? e.config.globalProperties : e.prototype
      ;(r[s] = function (e, t) {
        m(e, j.get(this), t), delete this.$firebaseRefs[e]
      }),
        (r[i] = function (e, n, i) {
          const s = Object.assign({}, o, i),
            r = t.toRef(this.$data, e)
          let c = j.get(this)
          c
            ? c[e] &&
              c[e](s.wait ? 'function' == typeof s.reset && s.reset : s.reset)
            : j.set(this, (c = {}))
          const f = y(r, e, n, c, s)
          return (this.$firebaseRefs[e] = n.ref), f
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
    Object.defineProperty(e, '__esModule', { value: !0 }),
    e
  )
})({}, VueDemi)
