import { ref, reactive } from 'vue'
import { contentStore } from './content.ts'
import { isNumeric, isEmpty } from './util.ts'
import { urlParams } from './param'

const center = [35.16449979644708, 136.89952345222818]

export const baseLayersStore = reactive({
  layers: [],

  setLayer({ name, visible, icon, layer }) {
    this.layers.push({
      name,
      visible,
      icon,
      layer,
    })
    window.map.addLayer(layer).setVisible(visible)
  },

  changeLayer(idx) {
    for (const [i, item] of this.layers.entries()) {
      const visible = idx == i
      item.layer.setVisible(visible)
      item.visible = visible
    }
  },
})

export const layersStore = reactive({
  layers: [],

  getFeature(idx, sid) {
    const l = this.layers.at(idx)
    let r = null
    if (!isEmpty(l)) {
      l.layer.eachData((f) => {
        if (f.id == sid) {
          r = f
          return true
        }
      })
    }

    return r
  },

  addLayer(title, style, features, visible = true) {
    const layer = window.gwk.geoJSON(null, {
      style,
      render: (geojson, defaultStyle) => {
        return (geojson, defaultStyle)
      },
    })
    layer.clear()
    layer.setVisible(visible)
    layer.bindPopup(function (e) {
      const name = e.geojson?.properties['施設・場所名']
      if (name !== null) {
        return name
      }
    })

    for (const data of features) {
      layer.addData(data)
    }

    if (window.map) {
      window.map.addLayer(layer)
    }

    this.layers.push({
      title,
      visible,
      layer,
    })
  },

  switchLayer(idx) {
    for (const [i, item] of this.layers.entries()) {
      const visible = idx == i
      item.visible = visible
      item.layer.setVisible(visible)
    }

    contentStore.clear()
  },

  setVisible(idx, state) {
    const l = this.layers[idx]
    if (l === null || l === undefined) {
      return
    }

    l.visible = state
    l.layer.setVisible(state)
  },
})

const loadFile = async (path): Promise<object> => {
  return new Promise((resolve, reject) => {
    fetch(path)
      .then((r) => {
        if (!r.ok) {
          reject()
        }
        r.json().then(resolve).catch(reject)
      })
      .catch(reject)
  })
}

export const panTo = (lat, lon) => {
  if (isEmpty(window.map)) {
    return
  }
  window.map.panTo([lat, lon])
}

export const mapInit = async (_gwk) => {
  let zoom = 15

  const params = urlParams.read()

  if (params.center !== null) {
    center[0] = params.center[0]
    center[1] = params.center[1]
  }

  if (params.zoom !== null) {
    zoom = params.zoom
  }

  const map = _gwk.map('map', {
    center,
    zoom,
    disableRotate: false,
  })

  window.map = map

  baseLayersStore.setLayer({
    name: '標準',
    visible: true,
    icon: 'screenshot-20260609-160043.jpg',
    layer: _gwk.stdTiles.get('std'),
  })

  baseLayersStore.setLayer({
    name: '航空地図',
    visible: false,
    icon: 'screenshot-20260609-160045.jpg',
    layer: _gwk.gsiTiles.get('ort'),
  })

  baseLayersStore.setLayer({
    name: '起伏地図',
    visible: false,
    icon: 'screenshot-20260609-160047.jpg',
    layer: _gwk.gsiTiles.get('relief'),
  })

  // geojsonファイルロード時のコールバック
  // TODO: 読み取り失敗時にレイヤリストのインデックスがズレないよう修正
  const f = (style, visible) => {
    return (j) => {
      layersStore.addLayer(j.name, style, j.features, visible)
    }
  }

  layersStore.switchLayer(params.layer)

  await loadFile('/hinan.geojson').then(
    f(
      {
        point: _gwk.iconStyles.get('basic_002', 'blue'),
      },
      true,
    ),
  )

  await loadFile('/sitei.geojson').then(
    f(
      {
        point: _gwk.iconStyles.get('basic_002', 'green'),
      },
      false,
    ),
  )

  if (params.sid !== null) {
    const feature = layersStore.getFeature(params.layer, params.sid)
    if (!isEmpty(feature)) {
      contentStore.setFeature(feature)
      // 中心点を移動
      panTo(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    }
  }

  // 地点クリック時のコールバック
  map.extractor.addHandler('select', (v) => {
    contentStore.setFeature(v.geojson)
  })

  // 現在地表示用ピンレイヤー
  const pinLayer = gwk.geoJSON(null, {
    style: {
      point: gwk.iconStyles.get('symbol_003', 'rgba(0, 0, 0, 1)'),
    },
  })
  map.addLayer(pinLayer)

  /// 現在地ボタンの追加
  const mapView = map.getMapView()
  const gpsButton = new gwb.ui.GPS(mapView)
  gpsButton.enableHighAccuracy = false
  gpsButton.events.addHandler('moved', (e) => {
    const geo = {
      type: 'Feature',
      properties: {
        SID: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [e.pos.coordinate.x, e.pos.coordinate.y],
      },
    }

    urlParams.setParam('center', [e.pos.coordinate.x, e.pos.coordinate.y])

    pinLayer.clear()
    pinLayer.addData(geo)
  })

  mapView.getControls().push(gpsButton)
}

export const updateSize = (): void => {
  window.map !== null && window.map._mapView.updateSize()
}
