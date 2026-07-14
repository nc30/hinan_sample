import { reactive } from 'vue'
import { isNumeric, isEmpty } from './util.ts'
import type { CoordinateType } from './types.d'

type UrlParam = 'center' | 'zoom' | 'layer' | 'sid'
type UrlParamType = {
  center: CoordinateType | null
  zoom: number | null
  layer: number | null
  sid: string | null

  read: () => any
  getUrl: () => string
  setParam: (k: UrlParam, v: any) => void
}

export const urlParams = reactive<UrlParamType>({
  center: null,
  zoom: 16,
  layer: 0,
  sid: null,

  read() {
    const sp = new URL(window.location.href).searchParams

    if (sp.has('center')) {
      try {
        const c: number[] | undefined = sp
          .get('center')
          ?.split(',')
          .map((z) => z.trim())
          .filter((z) => !isEmpty(z))
          .filter((z) => isNumeric(z))
          .map((z) => Number(z))

        if (
          c != undefined &&
          c[0] !== undefined &&
          c[1] !== undefined &&
          -90 <= c[0] &&
          c[0] <= 90 &&
          -180 <= c[1] &&
          c[1] <= 180
        ) {
          this.center = [c[0], c[1]]
        }
      } catch (e) {}
    }

    if (sp.has('zoom')) {
      const z = sp.get('zoom')?.trim()
      if (isNumeric(z)) {
        this.zoom = Number(z)
      }
    }

    if (sp.has('layer')) {
      const z = sp.get('layer')?.trim()
      if (isNumeric(z)) {
        this.layer = Number(z)
      }
    }

    if (sp.has('id')) {
      const z = sp.get('id')?.trim()
      if (z !== undefined) {
        this.sid = z
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
