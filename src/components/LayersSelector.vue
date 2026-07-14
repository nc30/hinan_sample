<script setup lang="ts">
import { ref, watch } from 'vue'
import { layersStore } from '../map'
import { urlParams } from '../param'

const selected = ref<number | null>(urlParams.layer)
watch(
  selected,
  () => {
    if (selected.value != null) {
      layersStore.switchLayer(selected.value)
      urlParams.setParam('layer', selected)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div id="layersSelector">
    <select v-model="selected">
      <option
        type="checkbox"
        v-for="(layer, idx) in layersStore.layers"
        :value="idx"
      >
        {{ layer.title }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
select {
  display: inline-block;
  width: 100%;
  padding: 5px;
}
</style>
