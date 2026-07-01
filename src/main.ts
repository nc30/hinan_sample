import '../assets/style.scss'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { mapInit } from './map'

const _initialized = ref(false)

const initialize = async (): Promise<any> => {
  return new Promise((resolve) => {
  	// if (_initialized && window.gwk?.map) {
  	// 	resolve(window.gwk)
  	// }
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

initialize().then(_gwk=>{
  createApp(App).mount('#app')
  mapInit(_gwk)
})
