<script setup lang="ts">
import { ref } from 'vue'
import SideMenu from './components/SideMenu.vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const menuOpen = ref(true)
</script>

<template>
  <div id="wrp" :class="{ menuOpen: menuOpen, mobileMode: mobile }">
    <div class="_content">
      <SideMenu />
    </div>
    <div id="map"></div>
    <div id="mobileHead" v-if="mobile">
      <h1><i class="bi bi-person-walking"></i>防災マップ</h1>
    </div>
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
    > ._content {
      width: 450px;
    }
  }

  &.menuOpen.mobileMode {
    > ._content {
      width: 100%;
      height: 80%;
    }
  }

  &.mobileMode {
    flex-direction: column-reverse;

    > ._content {
      height: 20%;
    }
  }

  > ._content {
    width: 0px;
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;

    border: solid red 1px;
  }
}

#mobileHead {
  height: 66px;
  text-align: center;
  color: #48af7f;
  flex-shrink: 0;
  h1 {
    margin: 8px;
  }
}

#map {
  flex: 1;
}
</style>
