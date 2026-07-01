import { reactive } from 'vue'
import { urlParams } from './param'

export const contentStore = reactive({
  current: null,

  clear: function() {
    this.current = null
    urlParams.setParam('id', null)
  },

  setFeature: function(feature) {
    this.current = feature
    urlParams.setParam('id', feature.geojson.id)
  }
})
