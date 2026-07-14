/*
  表示ポイント用ストア
*/

import { reactive } from 'vue'
import { isEmpty } from './util'
import { urlParams } from './param'

import type { GeojsonType } from './types.d'

type ContentStoreType = {
  current: GeojsonType | null
  clear: () => void
  setFeature: (geojson: GeojsonType | null) => void
}

export const contentStore = reactive<ContentStoreType>({
  current: null,

  clear: function () {
    this.current = null
    urlParams.setParam('sid', null)
  },

  setFeature: function (geojson) {
    this.current = geojson
    if (geojson !== null) {
      // urlにidを反映させる
      urlParams.setParam('sid', geojson.id)
    }
  },
})
