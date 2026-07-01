<script setup lang="ts">
  import { ref } from 'vue'
  import SideMenu from './components/SideMenu.vue'

  const menuOpen = ref(true)

</script>

<template>
  <div id="wrp" :class="{'menuOpen': menuOpen}">
    <div id="sideMenu"  >
      <SideMenu />
    </div>
    <div id="map"></div>
  </div>
</template>

<style scoped lang="scss">
  #wrp {
    position: relative;
    width: 100dvw;
    height: 100dvh;
    background-color: #fff;
    display: flex;

    &.menuOpen {
      #sideMenu {
        width: 450px;
      }
    }
  }

  #sideMenu {
    width: 0px;
    border-right: 1px solid black;
  }
  #map {
    width: 100%;
    height: 100%;
  }
</style>
