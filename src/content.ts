/*
  表示ポイント用ストア
*/

import { reactive } from 'vue'
import { isEmpty } from './util'
import { urlParams } from './param'

export const contentStore = reactive({
  current: null,

  clear: function () {
    this.current = null
    urlParams.setParam('sid', null)
  },

  setFeature: function (geojson) {
    this.current = geojson
    if (!isEmpty(geojson)) {
      // urlにidを反映させる
      urlParams.setParam('sid', geojson.id)
    }
  },
})
