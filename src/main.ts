import '../assets/style.scss'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { mapInit } from './map'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import type { GisapEmbeddedMapType } from './types.d'

declare global {
  /* eslint no-var: 0 */
  var gwk: any
  /* eslint no-var: 0 */
  var gwb: any
  /* eslint no-var: 0 */
  var map: GisapEmbeddedMapType

  /* eslint no-var: 0 */
  var loadedCallback: () => void
}

const _initialized = ref(false)

const initialize = async (): Promise<any> => {
  return new Promise((resolve) => {
    if (window.gwk?.map) {
      document.body.classList.add('app-loaded')
      _initialized.value = true
      resolve(window.gwk)
    }
    window.loadedCallback = () => {
      document.body.classList.add('app-loaded')
      _initialized.value = true
      resolve(window.gwk)
    }
  })
}

initialize().then((_gwk) => {
  const vuetify = createVuetify()
  createApp(App).use(vuetify).mount('#app')
  mapInit(_gwk)
})
