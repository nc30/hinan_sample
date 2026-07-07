import { reactive } from 'vue'
import { isNumeric, isEmpty } from './util.ts'

export const urlParams = reactive({
  center: null,
  zoom: 16,
  layer: 0,
  sid: null,

  read() {
    const sp = new URL(window.location.href).searchParams

    if (sp.has('center')) {
      try {
        const c = sp
          .get('center')
          .split(',')
          .map((z) => z.trim())
          .filter((z) => !isEmpty(z))
          .filter((z) => isNumeric(z))
          .map((z) => Number(z))
        if (
          a.length === 2 &&
          -90 <= a[0] &&
          a[0] <= 90 &&
          -180 <= a[1] &&
          a[1] <= 180
        ) {
          this.center = [a[0], a[1]]
        }
      } catch (e) {}
    }

    if (sp.has('zoom')) {
      const z = sp.get('zoom').trim()
      if (isNumeric(z)) {
        this.zoom = z
      }
    }

    if (sp.has('layer')) {
      const z = sp.get('layer').trim()
      if (isNumeric(z)) {
        this.layer = Number(z)
      }
    }

    if (sp.has('id')) {
      const z = sp.get('id').trim()
      if (isNumeric(z)) {
        this.sid = Number(z)
      }
    }

    return {
      center: this.center,
      zoom: this.zoom,
      layer: this.layer,
      sid: this.sid,
    }
  },

  getUrl() {
    const r = new URL(window.location.href)

    if (this.center !== null) {
      r.searchParams.set('center', `${this.center[0]},${this.center[1]}`)
    }
    if (this.zoom !== null) {
      r.searchParams.set('zoom', `${this.zoom}`)
    }
    if (this.layer !== null) {
      r.searchParams.set('layer', `${this.layer}`)
    }
    if (this.sid !== null) {
      r.searchParams.set('id', `${this.sid}`)
    }

    return r.toString()
  },

  setParam(k, v) {
    this[k] = v

    window.history.replaceState({}, '', this.getUrl())
  },
})
