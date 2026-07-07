<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import Info from './Info.vue'
import BaseLayers from './BaseLayers.vue'
import LayersCheckbox from './LayersCheckbox.vue'
import LayersSelector from './LayersSelector.vue'

const { mobile } = useDisplay()
</script>

<template>
  <div id="sideBar" :style="{ mobileMode: mobile }">
    <div class="_head" v-if="!mobile">
      <h1><i class="bi bi-person-walking"></i>防災マップ</h1>
    </div>
    <div class="_body">
      <div class="__inner">
        <BaseLayers />
        <div>
          <h2>地域・種別選択</h2>
          <LayersCheckbox />
          <LayersSelector />
        </div>
        <div>
          <br />
          <Info />
        </div>
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
  width: 100%;

  > ._head {
    height: 100px;
  }

  > ._body {
    padding: 2em 1em;
    height: 100%;
    overflow-y: scroll;
    width: 100%;

    > .__inner {
      max-width: 600px;
      margin: auto;
    }
  }

  &.mobileMode {
    > ._body {
      height: calc(100% - 100px);
    }
  }
}

h1 {
  border-radius: 1px;
  color: #48af7f;
}
</style>
