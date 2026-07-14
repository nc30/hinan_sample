<script setup lang="ts">
import { computed } from 'vue'
import { layersStore } from '../map'

const list = computed(() => {
  return layersStore.layers.filter((z) => z.visible)
})
</script>

<template>
  <div id="legends" v-if="list.length > 0">
    凡例
    <div>
      <ul>
        <li v-for="layer in list">
          <span class="_color">
            <img
              v-if="layer.defaultStyle !== null && 'icon' in layer.defaultStyle"
              :src="layer.defaultStyle.icon"
            /> </span
          >{{ layer.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
#legends {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  min-width: 100px;
  background-color: #fff;
  border-radius: 5px;
  border: solid #333 1px;

  ._color {
    display: inline-block;
    width: 1em;
    height: 1em;
    border-radius: 0.5em;
    margin-right: 0.5em;
  }
}
</style>
