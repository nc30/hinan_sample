<script setup lang="ts">
import { layersStore } from '../map'

const change = (idx: number) => {
  const layer = layersStore.layers[idx]
  if (layer != undefined) {
    layersStore.setVisible(idx, !layer.visible)
  }
}
</script>

<template>
  <div id="layersCheckbox">
    <ul>
      <li v-for="(layer, idx) in layersStore.layers">
        <label>
          <input
            type="checkbox"
            @change="() => change(Number(idx))"
            :checked="layer.visible"
          />
          <span
            class="_color"
            v-if="layer.defaultStyle !== null && 'icon' in layer.defaultStyle"
            ><img :src="layer.defaultStyle.icon"
          /></span>
          {{ layer.title }}
        </label>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
#layersCheckbox {
  border: solid #333 1px;
  padding: 5px;
  margin-bottom: 10px;

  li label {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    ._color {
      display: inline-block;
      width: 1em;
      height: 1em;
      border-radius: 0.5em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      margin-top: -5px;
    }
  }

  label {
    user-select: none;
  }
}
</style>
