<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { layersStore } from '../map'
  import { urlParams } from '../param'
  import Info from './Info.vue'
  import BaseLayers from './BaseLayers.vue'

  const selected = ref(urlParams.layer)

  watch(selected, () => {
    layersStore.switchLayer(selected.value)
    urlParams.setParam('layer', selected)
  }, { immediate: true })

</script>

<template>
<div id="sideBar">
  <div class="_head">
    <h1><i class="bi bi-person-walking"></i>防災マップ</h1>
  </div>
  <div class="_body">
    <BaseLayers/>
    <div>
      <h2>地域・種別選択</h2>
      <select v-model="selected" >
        <option type="checkbox" v-for="(layer, idx) in layersStore.layers" :value="idx" >{{layer.title}}</option>
      </select>
    </div>
    <div>
      <br/>
      <Info />
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
  #sideBar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;

    > ._head {
      height: 100px;
    }

    > ._body {
      padding: 2em 1em;
      height: 100%;
      overflow-y: auto;
    }
  }
  h1 {
    border-radius: 1px;
    color: #48af7f;
  }
  select {
    display: inline-block;
    width: 100%;
    padding: 5px;
  }
</style>
