<script setup lang="ts">
  import { layersStore } from '../map'

  const change = (idx) => {
    layersStore.setVisible(idx, !layersStore.layers[idx].visible)
  }
</script>

<template>
  <ul>
    <li v-for="(layer, idx) in layersStore.layers" >
      <label><input type="checkbox" @change="()=>change(idx)" :checked="layer.visible" >{{layer.title}}</label>
    </li>
  </ul>
</template>
