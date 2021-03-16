/*!
 * vuefire v3.0.0-alpha.9
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
  function a(e, t, n) {
    const o = [{}, {}],
      r = Object.keys(n).reduce((e, t) => {
        const o = n[t]
        return (e[o.path] = o.data()), e
      }, {})
    return (
      (function e(t, n, o, c) {
        n = n || {}
        const [a, f] = c
        Object.getOwnPropertyNames(t).forEach((e) => {
          const n = Object.getOwnPropertyDescriptor(t, e)
          n && !n.enumerable && Object.defineProperty(a, e, n)
        })
        for (const c in t) {
          const u = t[c]
          if (
            null == u ||
            u instanceof Date ||
            u.toDate ||
            (u.longitude && u.latitude)
          )
            a[c] = u
          else if (s(u))
            (a[c] =
              'object' == typeof n && c in n && 'string' != typeof n[c]
                ? n[c]
                : u.path),
              (f[o + c] = u)
          else if (Array.isArray(u)) {
            a[c] = Array(u.length)
            for (let e = 0; e < u.length; e++) {
              const t = u[e]
              t && t.path in r && (a[c][e] = r[t.path])
            }
            e(u, n[c] || a[c], o + c + '.', [a[c], f])
          } else
            i(u)
              ? ((a[c] = {}), e(u, n[c], o + c + '.', [a[c], f]))
              : (a[c] = u)
        }
      })(e, t, '', o),
      o
    )
  }
  const f = {
    maxRefDepth: 0,
    reset: !0,
    serialize: function (e) {
      return Object.defineProperty(e.data() || {}, 'id', { value: e.id })
    },
    wait: !1,
  }
  function u(e) {
    for (const t in e) e[t].unsub()
  }
  function l(e, t, o, i, s, r, c, f) {
    const [u, l] = a(e.serialize(i), n(t, o), s)
    r.set(t, o, u), p(e, t, o, s, l, r, c, f)
  }
  function d({ ref: e, target: t, path: n, depth: o, resolve: i, ops: s }, r) {
    const c = Object.create(null),
      a = e.onSnapshot((e) => {
        e.exists ? l(r, t, n, e, c, s, o, i) : (s.set(t, n, null), i())
      })
    return () => {
      a(), u(c)
    }
  }
  function p(e, t, o, i, s, r, c, a) {
    const f = Object.keys(s)
    if (
      (Object.keys(i)
        .filter((e) => f.indexOf(e) < 0)
        .forEach((e) => {
          i[e].unsub(), delete i[e]
        }),
      !f.length || ++c > e.maxRefDepth)
    )
      return a(o)
    let u = 0
    const l = f.length,
      p = Object.create(null)
    function h(e) {
      e in p && ++u >= l && a(o)
    }
    f.forEach((a) => {
      const f = i[a],
        u = s[a],
        l = `${o}.${a}`
      if (((p[l] = !0), f)) {
        if (f.path === u.path) return
        f.unsub()
      }
      i[a] = {
        data: () => n(t, l),
        unsub: d(
          {
            ref: u,
            target: t,
            path: l,
            depth: c,
            ops: r,
            resolve: h.bind(null, l),
          },
          e
        ),
        path: u.path,
      }
    })
  }
  function h(e, n, o, i, s, r = f) {
    const c = Object.assign({}, f, r),
      l = 'value',
      d = new Map()
    ;(e[l] = d), c.wait || o.set(e, l, d)
    let h = t.ref(c.wait ? d : e[l])
    const b = i
    let g
    const m = [],
      y = {
        added: ({ newIndex: t, doc: n }) => {
          m.splice(t, 0, Object.create(null))
          const s = m[t],
            [r, f] = a(c.serialize(n), void 0, s)
          o.mapAdd(e[l], n.id, r),
            p(c, h, `value.${t}`, s, f, o, 0, i.bind(null, n))
        },
        modified: ({ oldIndex: n, newIndex: s, doc: r }) => {
          const f = t.unref(h),
            u = m[n],
            d = f[n],
            [b, g] = a(c.serialize(r), d, u)
          m.splice(s, 0, u),
            o.mapAdd(e[l], r.id, b),
            p(c, h, `value.${s}`, u, g, o, 0, i)
        },
        removed: ({ oldIndex: t, doc: n }) => {
          o.mapRemove(e[l], n.id), u(m.splice(t, 1)[0])
        },
      },
      v = n.onSnapshot((n) => {
        const s =
          'function' == typeof n.docChanges ? n.docChanges() : n.docChanges
        if (!g && s.length) {
          g = !0
          let t = 0
          const n = s.length,
            r = Object.create(null)
          for (let e = 0; e < n; e++) r[s[e].doc.id] = !0
          i = ({ id: s }) => {
            s in r &&
              ++t >= n &&
              (c.wait && o.set(e, l, d), b(d), (i = () => {}))
          }
        }
        s.forEach((e) => {
          y[e.type](e)
        }),
          s.length || (c.wait && o.set(e, l, d), i(t.unref(d)))
      }, s)
    return (t) => {
      if ((v(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : []
        o.set(e, l, n)
      }
      m.forEach(u)
    }
  }
  function b(e, t, o, i, s, r = f) {
    const c = Object.assign({}, f, r),
      a = 'value',
      d = Object.create(null)
    i = (function (e, t) {
      let n = !1
      return () => {
        if (!n) return (n = !0), e(t())
      }
    })(i, () => n(e, a))
    const p = t.onSnapshot((t) => {
      t.exists ? l(c, e, a, t, d, o, 0, i) : (o.set(e, a, null), i(null))
    }, s)
    return (t) => {
      if ((p(), !1 !== t)) {
        const n = 'function' == typeof t ? t() : null
        o.set(e, a, n)
      }
      u(d)
    }
  }
  const g = {
    set: (e, t, n) => o(e, t, n),
    add: (e, t, n) => e.splice(t, 0, n),
    remove: (e, t) => e.splice(t, 1),
    mapAdd: (e, t, n) => e.set(t, n),
    mapRemove: (e, t) => e.delete(t),
  }
  function m(e, n, o, i, s) {
    return new Promise((a, f) => {
      let u
      ;(u = Array.isArray(e.value)
        ? (function (
            { target: e, collection: n, resolve: o, reject: i, ops: s },
            a = c
          ) {
            const f = Object.assign({}, c, a),
              u = 'value'
            f.wait || s.set(e, u, [])
            let l = t.ref(f.wait ? [] : e[u])
            const d = n.on('child_added', (e, n) => {
                const o = t.unref(l),
                  i = n ? r(o, n) + 1 : 0
                s.add(o, i, f.serialize(e))
              }),
              p = n.on('child_removed', (e) => {
                const n = t.unref(l)
                s.remove(n, r(n, e.key))
              }),
              h = n.on('child_changed', (e) => {
                const n = t.unref(l)
                s.set(n, r(n, e.key), f.serialize(e))
              }),
              b = n.on('child_moved', (e, n) => {
                const o = t.unref(l),
                  i = r(o, e.key),
                  c = s.remove(o, i)[0],
                  a = n ? r(o, n) + 1 : 0
                s.add(o, a, c)
              })
            return (
              n.once(
                'value',
                (n) => {
                  const i = t.unref(l)
                  f.wait && s.set(e, u, i), o(n)
                },
                i
              ),
              (t) => {
                if (
                  (n.off('child_added', d),
                  n.off('child_changed', h),
                  n.off('child_removed', p),
                  n.off('child_moved', b),
                  !1 !== t)
                ) {
                  const n = 'function' == typeof t ? t() : []
                  s.set(e, u, n)
                }
              }
            )
          })({ target: e, collection: o, resolve: a, reject: f, ops: g }, s)
        : (function (
            { target: e, document: t, resolve: n, reject: o, ops: i },
            s = c
          ) {
            const r = 'value',
              a = Object.assign({}, c, s),
              f = t.on('value', (t) => {
                i.set(e, r, a.serialize(t))
              })
            return (
              t.once('value', n, o),
              (n) => {
                if ((t.off('value', f), !1 !== n)) {
                  const t = 'function' == typeof n ? n() : null
                  i.set(e, r, t)
                }
              }
            )
          })({ target: e, document: o, resolve: a, reject: f, ops: g }, s)),
        (i[n] = u)
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
      mapAdd: (e, t, n) => e.set(t, n),
      mapRemove: (e, t) => e.delete(t),
      add: (e, t, n) => e.splice(t, 0, n),
      remove: (e, t) => e.splice(t, 1),
    }
  function $(e, t, n) {
    let o
    return [
      new Promise((i, s) => {
        o = ('where' in t ? h : b)(e, t, w, i, s, n)
      }),
      o,
    ]
  }
  function R(e, t, n) {
    t && t[e] && (t[e](n), delete t[e])
  }
  const P = {
      bindName: '$bind',
      unbindName: '$unbind',
      serialize: f.serialize,
      reset: f.reset,
      wait: f.wait,
    },
    z = new WeakMap()
  return (
    (e.firestoreBind = function (e, n, o) {
      const [i, s] = $(e, n, o)
      return (
        z.set(e, { '': s }),
        t.getCurrentInstance() &&
          t.onBeforeUnmount(() => {
            s(o && o.reset)
          }),
        i
      )
    }),
    (e.firestorePlugin = function (e, n = P) {
      const o = Object.assign({}, P, n),
        { bindName: i, unbindName: s } = o,
        r = t.isVue3 ? e.config.globalProperties : e.prototype
      ;(r[s] = function (e, t) {
        R(e, z.get(this), t), delete this.$firestoreRefs[e]
      }),
        (r[i] = function (e, n, i) {
          const s = Object.assign({}, o, i),
            r = t.toRef(this.$data, e)
          let c = z.get(this)
          c
            ? c[e] &&
              c[e](s.wait ? 'function' == typeof s.reset && s.reset : s.reset)
            : z.set(this, (c = {}))
          const [a, f] = $(r, n, s)
          return (c[e] = f), (this.$firestoreRefs[e] = n), a
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
            const e = z.get(this)
            if (e) for (const t in e) e[t]()
            this.$firestoreRefs = null
          },
        })
    }),
    (e.firestoreUnbind = (e, t) => R('', z.get(e), t)),
    (e.rtdbBind = function (e, n, o) {
      const i = {}
      j.set(e, i)
      const s = m(e, '', n, i, o)
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
        y(e, j.get(this), t), delete this.$firebaseRefs[e]
      }),
        (r[i] = function (e, n, i) {
          const s = Object.assign({}, o, i),
            r = t.toRef(this.$data, e)
          let c = j.get(this)
          c
            ? c[e] &&
              c[e](s.wait ? 'function' == typeof s.reset && s.reset : s.reset)
            : j.set(this, (c = {}))
          const a = m(r, e, n, c, s)
          return (this.$firebaseRefs[e] = n.ref), a
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
