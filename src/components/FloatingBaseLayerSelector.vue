<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { baseLayersStore } from '../map'

const open = ref(false)

const changeBaseLayer = (idx: number) => {
  baseLayersStore.changeLayer(idx)
}

const sw = (ev: KeyboardEvent) => {
  if (ev.keyCode === 27) open.value = false
}

watch(open, () => {
  if (open) {
    window.addEventListener('keydown', sw)
  } else {
    window.removeEventListener('keydown', sw)
  }
})

const currentLayer = computed(() => {
  for (const [idx, layer] of baseLayersStore.layers.entries()) {
    if (layer.visible) {
      return layer
    }
  }

  return null
})
</script>

<template>
  <div id="FloatingBaseLayerSelector" v-if="currentLayer != null">
    <div class="_current" @click.prevent="() => (open = !open)">
      <img :src="currentLayer.icon" />
    </div>

    <ul v-if="open" class="_selector">
      <li
        v-for="(layer, idx) in baseLayersStore.layers"
        @click="
          () => {
            changeBaseLayer(idx)
            open = false
          }
        "
        class="item"
        :class="{ active: layer.visible }"
      >
        <img :src="layer.icon" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
#FloatingBaseLayerSelector {
  position: absolute;
  bottom: 40px;
  left: 10px;

  & > ._current {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 5px;
    border: solid #2c2e99 1px;
    cursor: pointer;
  }

  & > ._selector {
    position: absolute;
    top: -10px;
    left: 80px;

    display: flex;
    border: solid #2c2e99 1px;
    border-radius: 5px;
    padding: 10px 5px;
    padding-left: 25px;
    justify-content: space-evenly;
    background-color: #fff;
  }

  .item {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      width: 50px;
      margin-right: 20px;
      border-radius: 5px;
      border: solid #fff0 3px;
    }

    &.active {
      img {
        border-color: #2c2e99;
      }
    }
  }
}
</style>
