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
  function f(e, t, n) {
    const o = [{}, {}],
      s = Object.keys(n).reduce((e, t) => {
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
          else if (r(u))
            (f[c] =
              'object' == typeof n && c in n && 'string' != typeof n[c]
                ? n[c]
                : u.path),
              (a[o + c] = u)
          else if (Array.isArray(u)) {
            f[c] = Array(u.length)
            for (let e = 0; e < u.length; e++) {
              const t = u[e]
              t && t.path in s && (f[c][e] = s[t.path])
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
  function l(e, t, o, i, r, s, c, a) {
    const [u, l] = f(e.serialize(i), n(t, o), r)
    s.set(t, o, u), h(e, t, o, r, l, s, c, a)
  }
  function d({ ref: e, target: t, path: n, depth: o, resolve: i, ops: r }, s) {
    const c = Object.create(null),
      f = e.onSnapshot((e) => {
        e.exists ? l(s, t, n, e, c, r, o, i) : (r.set(t, n, null), i())
      })
    return () => {
      f(), u(c)
    }
  }
  function h(e, t, o, i, r, s, c, f) {
    const a = Object.keys(r)
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
    function p(e) {
      e in h && ++u >= l && f(o)
    }
    a.forEach((f) => {
      const a = i[f],
        u = r[f],
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
            ops: s,
            resolve: p.bind(null, l),
          },
          e
        ),
        path: u.path,
      }
    })
  }
  function p(e, n, o, i, r, s = a) {
    const c = Object.assign({}, a, s),
      l = 'value'
    c.wait || o.set(e, l, [])
    let d = t.ref(c.wait ? [] : e[l])
    const p = i
    let b
    const g = [],
      y = {
        added: ({ newIndex: e, doc: n }) => {
          g.splice(e, 0, Object.create(null))
          const r = g[e],
            [s, a] = f(c.serialize(n), void 0, r)
          o.add(t.unref(d), e, s),
            h(c, d, `value.${e}`, r, a, o, 0, i.bind(null, n))
        },
        modified: ({ oldIndex: e, newIndex: n, doc: r }) => {
          const s = t.unref(d),
            a = g[e],
            u = s[e],
            [l, p] = f(c.serialize(r), u, a)
          g.splice(n, 0, a),
            o.remove(s, e),
            o.add(s, n, l),
            h(c, d, `value.${n}`, a, p, o, 0, i)
        },
        removed: ({ oldIndex: e }) => {
          const n = t.unref(d)
          o.remove(n, e), u(g.splice(e, 1)[0])
        },
      },
      m = n.onSnapshot((n) => {
        const r =
          'function' == typeof n.docChanges ? n.docChanges() : n.docChanges
        if (!b && r.length) {
          b = !0
          let n = 0
          const s = r.length,
            f = Object.create(null)
          for (let e = 0; e < s; e++) f[r[e].doc.id] = !0
          i = ({ id: r }) => {
            r in f &&
              ++n >= s &&
              (c.wait && o.set(e, l, t.unref(d)), p(t.unref(d)), (i = () => {}))
          }
        }
        r.forEach((e) => {
          y[e.type](e)
        }),
          r.length || (c.wait && o.set(e, l, t.unref(d)), i(t.unref(d)))
      }, r)
    return (t) => {
      if ((m(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : []
        o.set(e, l, n)
      }
      g.forEach(u)
    }
  }
  function b(e, t, o, i, r, s = a) {
    const c = Object.assign({}, a, s),
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
    }, r)
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
  function y(e, n, o, i, r) {
    return new Promise((f, a) => {
      let u
      ;(u = Array.isArray(e.value)
        ? (function (
            { target: e, collection: n, resolve: o, reject: i, ops: r },
            f = c
          ) {
            const a = Object.assign({}, c, f),
              u = 'value'
            a.wait || r.set(e, u, [])
            let l = t.ref(a.wait ? [] : e[u])
            const d = n.on('child_added', (e, n) => {
                const o = t.unref(l),
                  i = n ? s(o, n) + 1 : 0
                r.add(o, i, a.serialize(e))
              }),
              h = n.on('child_removed', (e) => {
                const n = t.unref(l)
                r.remove(n, s(n, e.key))
              }),
              p = n.on('child_changed', (e) => {
                const n = t.unref(l)
                r.set(n, s(n, e.key), a.serialize(e))
              }),
              b = n.on('child_moved', (e, n) => {
                const o = t.unref(l),
                  i = s(o, e.key),
                  c = r.remove(o, i)[0],
                  f = n ? s(o, n) + 1 : 0
                r.add(o, f, c)
              })
            return (
              n.once(
                'value',
                (n) => {
                  const i = t.unref(l)
                  a.wait && r.set(e, u, i), o(n)
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
                  r.set(e, u, n)
                }
              }
            )
          })({ target: e, collection: o, resolve: f, reject: a, ops: g }, r)
        : (function (
            { target: e, document: t, resolve: n, reject: o, ops: i },
            r = c
          ) {
            const s = 'value',
              f = Object.assign({}, c, r),
              a = t.on('value', (t) => {
                i.set(e, s, f.serialize(t))
              })
            return (
              t.once('value', n, o),
              (n) => {
                if ((t.off('value', a), !1 !== n)) {
                  const t = 'function' == typeof n ? n() : null
                  i.set(e, s, t)
                }
              }
            )
          })({ target: e, document: o, resolve: f, reject: a, ops: g }, r)),
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
      serialize: a.serialize,
      reset: a.reset,
      wait: a.wait,
    },
    R = new WeakMap()
  return (
    (e.firestoreBind = function (e, n, o) {
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
          const [f, a] = $(s, n, r)
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
      P('', R.get(e), t)
    }),
    (e.rtdbBind = function (e, n, o) {
      const i = {}
      j.set(e, i)
      const r = y(e, '', n, i, o)
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
        m(e, j.get(this), t), delete this.$firebaseRefs[e]
      }),
        (s[i] = function (e, n, i) {
          const r = Object.assign({}, o, i),
            s = t.toRef(this.$data, e)
          let c = j.get(this)
          c
            ? c[e] &&
              c[e](r.wait ? 'function' == typeof r.reset && r.reset : r.reset)
            : j.set(this, (c = {}))
          const f = y(s, e, n, c, r)
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
