<script setup lang="ts">
import { baseLayersStore } from '../map'

const changeBaseLayer = (idx) => {
  baseLayersStore.changeLayer(idx)
}
</script>

<template>
  <div id="baseLayers">
    <h3>基本レイヤー</h3>
    <ul class="_list">
      <li
        v-for="(layer, idx) in baseLayersStore.layers"
        @click="() => changeBaseLayer(idx)"
        class="item"
        :class="{ active: layer.visible }"
      >
        <img :src="layer.icon" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
#baseLayers {
  & > ._list {
    display: flex;
    border: solid #2c2e99 1px;
    border-radius: 5px;
    padding: 10px 5px;
    justify-content: space-evenly;
  }
  .item {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      width: 80px;
      margin-right: 5px;
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
