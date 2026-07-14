import { ref, reactive } from 'vue'
import { contentStore } from './content.ts'
import { isNumeric, isEmpty } from './util.ts'
import { urlParams } from './param'

import type {} from './types.d'

import type {
  GisapEmbeddedStylesPointStyle,
  GisapEmbeddedLayersGeoJSONLayer,
  GeojsonType,
  GwkLayerType,
  StyleType,
  GeoType,
  MovedEvent,
  SelectEvent,
  FeatureType,
} from './types.d'

const center = [35.16449979644708, 136.89952345222818]

type LayerType = {
  name: string
  visible: boolean
  icon: string
  layer: GwkLayerType
}

type BaselayerStoreType = {
  layers: LayerType[]
  setLayer: (params: LayerType) => void
  changeLayer: (idx: number | string) => void
}

type LayersStoreType = {
  layers: {
    title: string
    visible: boolean
    color: string
    layer: GisapEmbeddedLayersGeoJSONLayer
    defaultStyle: GisapEmbeddedStylesPointStyle | null
  }[]

  getFeature: (idx: number, sid: string) => any | null
  addLayer: (
    title: string,
    style: any,
    features: any,
    visible: boolean,
    color: string,
  ) => void
  setVisible: (idx: number, state: boolean) => void
  switchLayer: (idx: number) => void
}

// 基本レイヤーのストア
export const baseLayersStore = reactive<BaselayerStoreType>({
  layers: [],

  setLayer(params: LayerType) {
    const { layer, visible } = params
    this.layers.push(params)
    window.map.addLayer(layer).setVisible(visible)
  },

  changeLayer(idx) {
    for (const [i, item] of this.layers.entries()) {
      const visible: boolean = idx == i
      item.layer.setVisible(visible)
      item.visible = visible
    }
  },
})

// フィーチャーレイヤーのストア
export const layersStore = reactive<LayersStoreType>({
  layers: [],

  getFeature(idx, sid) {
    const l = this.layers.at(idx)
    let r = null
    if (l !== undefined) {
      l.layer.eachData((f) => {
        if (f.id == sid) {
          r = f
          return true
        }
      })
    }

    return r
  },

  addLayer(title, style, features, visible = true, color = '#000') {
    const layer: GisapEmbeddedLayersGeoJSONLayer = window.gwk.geoJSON(null, {
      style,
      render: (geojson: GeojsonType, defaultStyle: StyleType) => {
        return defaultStyle
      },
    })
    layer.clear()
    layer.setVisible(visible)
    layer.bindPopup((e, position, nativeFeature) => {
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

    const defaultStyle = layer.styles.get(
      'point',
    ) as GisapEmbeddedStylesPointStyle

    this.layers.push({
      title,
      visible,
      layer,
      color,
      defaultStyle,
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

// jsonを読み込んでコールバックを叩く
const loadFile = async (path: string): Promise<GeoType> => {
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

export const panTo = (lat: number, lon: number) => {
  if (isEmpty(window.map)) {
    return
  }
  window.map.panTo([lat, lon], () => {})
}

export const mapInit = async (_gwk: any) => {
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
  const setGeoJsonCallback = (visible: boolean, color: string) => {
    return (j: GeoType) => {
      layersStore.addLayer(
        j.name,
        {
          point: _gwk.iconStyles.get('basic_002', color),
        },
        j.features,
        visible,
        color,
      )
    }
  }

  layersStore.switchLayer(params.layer)

  await loadFile('/hinan.geojson').then(setGeoJsonCallback(true, '#333'))

  await loadFile('/sitei.geojson').then(setGeoJsonCallback(false, 'green'))

  if (params.sid !== null) {
    const feature = layersStore.getFeature(params.layer, params.sid)
    if (!isEmpty(feature)) {
      contentStore.setFeature(feature)
      // 中心点を移動
      panTo(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    }
  }

  // 地点クリック時のコールバック
  map.extractor.addHandler('select', (v: SelectEvent) => {
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
  const gpsButton = new window.gwb.ui.GPS(mapView)
  gpsButton.enableHighAccuracy = false
  gpsButton.events.addHandler('moved', (e: MovedEvent) => {
    const geo = {
      type: 'Feature',
      sid: '0',
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

// 地図サイズ更新
export const updateSize = (): void => {
  window.map !== null && window.map._mapView.updateSize()
}
