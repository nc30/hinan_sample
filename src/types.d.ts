export type GwkMapType = {}

export type CoordinateType = [number, number]

export type GeoType = {
  type: string
  name: string
  features: GeojsonType[]
}

export type GeojsonType = {
  type: string
  id: string
  geometry: {
    type: string
    coordinates: CoordinateType
  }
  properties: {
    [key: string]: string
  }
}

export type FeatureType = {
  geojson: GeojsonType
  nativeFeature: object
  position: {
    epsg: number
    x: number
    y: number
  }
}

export type GisapEmebddedStylesStyleBase = {
  name: string
  clone: () => GisapEmebddedStylesStyleBase
  isValid: () => boolean
}

export type GisapEmbeddedGeoPos = {
  getInternalObject: () => [number, number] // TODO
  toLngLat: () => [number, number]
  toXY: (includeEPSG: boolean) => [number, number]
  transform: (toEPSG: number) => void
}
export type PopupCallback = (
  e: object,
  position: GisapEmbeddedGeoPos,
  nativeFeature: object,
) => string

export type GisapEmbeddedLayersLayerBaseType = {
  eachData: (callback: (geo: GeojsonType) => boolean | void) => void

  isSearchable: boolean
  addTo: (map: any) => void //TODO
  getMap: () => any // TODO
  getName: () => string
  getOpacity: () => number
  getVisible: () => boolean
  refresh: () => void
  remove: () => void
  setName: (value: string) => void
  setOpacity: (opacity: number) => void
  setVisible: (visible: boolean) => void
}

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#EachDataCallback
export type EachDataCallback = (
  geojson: object,
  nativeFeature: object,
) => boolean

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#GeoJSONDataCallback
export type GeoJsonDataCallback = (geojson: object) => void

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#RangeCallback
export type RangeCallback = (rect: object) => void

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#SelectDataCallback
export type SelectDataCallback = (
  geojson: object[],
  originalArgs: object,
) => void

//
export type GeoJsonRenderCallback = (
  geojson: object,
  style: GisapEmebddedStylesStyleBase,
) => GisapEmebddedStylesStyleBase

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#SelectionOptions
export type SelectionOptions = {
  // https://www.gisap-cloud.com/dev/Webkit/apidoc/nes.gisap.embedded.html#.OpTimes
  times: number
  multiSelection: boolean
  alwaysMultiSelection: boolean
  isOneClickDecision: boolean
}

export type GisapEmbeddedLayersGeoJSONLayer =
  GisapEmbeddedLayersLayerBaseType & {
    // https://www.gisap-cloud.com/dev/Webkit/apidoc/nes.gisap.embedded.layers.GeoJSONLayer.html

    selectable: boolean

    addData: (
      geoJSON: object,
      style: GisapEmebddedStylesStyleBase,
      nonCopy: boolean,
    ) => object
    bindPopup: (
      contents: string | PopupCallback,
    ) => GisapEmbeddedLayersGeoJSONLayer
    clear: () => void
    closePopup: () => GisapEmbeddedLayersGeoJSONLayer
    eachData: (
      callback: EachDataCallback,
      conditions: object,
      recordLimit: number,
      sortOrders: string,
      lastCallback: () => void,
    ) => void
    getData: (
      callback: GeoJsonDataCallback,
      conditions: object,
      recordLimit: number,
      sortOrders: string,
    ) => void
    getDataRange: (callback: RangeCallback, conditions: object) => void
    isPopupOpen: () => boolean
    isReadOnly: () => boolean
    openPopup: (pos: number[]) => GisapEmbeddedLayersGeoJSONLayer
    removeData: (keyData: object) => void
    selectData: (
      callback: SelectDataCallback,
      options: SelectionOptions,
    ) => object //TODO
    setRenderCallback: (
      callback: GeoJsonRenderCallback,
      noRefresh: boolean,
    ) => void
    togglePopup: () => GisapEmbeddedLayersGeoJSONLayer
    unbindPopup: () => GisapEmbeddedLayersGeoJSONLayer
  }

export type GwkLayerType = GisapEmbeddedLayersGeoJSONLayer

export type StyleType = {
  baloonOffset: [number, number]
  collor: string | null
  icon: string
  iconAnchor: number
  name: string
  opacity: number
  size: [number, number]
  strokeColor: string | null
  strokeWdith: number
}

export type MovedEvent = {
  pos: {
    coordSystemType: number
    coordinate: {
      x: number
      y: number
    }
  }
}

export type SelectEvent = {
  geojson: GeojsonType
  handled: boolean
  position: {
    epsg: number
    x: number
    y: number
  }
  nativeFeature: object
  layer: object
}

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#StyleOptions
export type StyleOptions = {
  point: object //TODO
  curve: object //TODO
  surface: object //TODO
}

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#ModifyingOptions
export type ModifyingOptions = {
  data: object | object[]
  // https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#ModifyingCallback
  callback: (geojsons: object[], originalArgs: object) => void
  transform: boolean
  isOneMove: boolean
  // https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#VertexOptions
  vertex: {
    url: string
    name: string
    minZoom: number
    maxZoom: number
    attributions: string | string[]
    style: StyleOptions
  }
}

// https://www.gisap-cloud.com/dev/Webkit/apidoc/global.html#EachLayerCallback
export type EachLayerCallback = (
  layer: GisapEmbeddedLayersLayerBaseType,
  key: string | object,
) => boolean

export type GisapEmbeddedMapType = {
  addLayer: (
    layer: GisapEmbeddedLayersLayerBaseType,
  ) => GisapEmbeddedLayersLayerBaseType
  adjustSize: () => void
  beginModifyOp: (options: ModifyingOptions) => void
  beginOperation: (op: any) => void //TODO
  beginTrackOp: (type: any, options: any) => void //TODO

  eachLayer: (callback: EachLayerCallback) => void
  exitOperation: (currentOperation?: any) => void // TODO
  fitBounds: (bounds: number[][], options?: any) => void
  flyTo: (centerPos: number[], callback: () => void) => void
  getCenter: () => any // TODO
  getMapView: () => any
  getMaxZoom: () => number
  getMinZoom: () => number
  getProjectionType: () => number
  getRotate: () => any //TODO
  getScale: (isRound: boolean) => number
  getSize: () => any //TODO
  getZoom: () => number
  hasLayer: (layer: GisapEmbeddedLayersLayerBaseType) => boolean

  measureArea: (GeoJson: object, options?: any) => number // TODO
  measureLength: (GeoJson: object, options?: any) => number // TODO

  panTo: (centerPos: number[], callback: () => void) => void
  rangeAt: (pos1_or_rect: any, pos2_or_epsg: any, inflateSize: any) => void // TODO
  refresh: () => void
  remove: () => void
  removeLayer: (layer: GisapEmbeddedLayersLayerBaseType) => boolean

  searchPos: (options: object) => void
  searchRoute: (options: object) => void
  setCenter: (centerPos: number[] | GisapEmbeddedGeoPos) => void

  setMaxZoom: (zoom: number) => void
  setMinZoom: (zoom: number) => void

  setRotate: (angle: any) => void // TODO
  setScale: (scale: number) => void
  setZoom: (zoom: number) => void
  showBalloon: (options: any) => any //TODO

  trackCircle: (options?: TrackOptions) => void
  trackFreeform: (options?: TrackOptions) => void
  trackLineString: (options?: TrackOptions) => void
  trackPoint: (options?: TrackOptions) => void
  trackPolygon: (options?: TrackOptions) => void

  zoomIn: () => void
  zoomOut: () => void

  _mapView: {
    updateSize: () => void
  }
}
