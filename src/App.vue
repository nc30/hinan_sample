<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import { updateSize } from './map'
import SideMenu from './components/SideMenu.vue'
import Legends from './components/Legends.vue'

const { mobile } = useDisplay()

const menuOpen = ref(true)

const toggle = () => {
  menuOpen.value = !menuOpen.value
  setTimeout(() => updateSize(), 100)
}
</script>

<template>
  <div id="wrp" :class="{ menuOpen: menuOpen, mobileMode: mobile }">
    <div class="_content">
      <div v-if="mobile" class="__control">
        <button v-if="menuOpen" @click.prevent="toggle">
          <i class="bi bi-chevron-bar-down"></i>
        </button>
        <button v-else @click.prevent="toggle">
          <i class="bi bi-chevron-bar-up"></i>
        </button>
      </div>
      <SideMenu />
    </div>
    <div id="map"></div>
    <div id="mobileHead" v-if="mobile">
      <h1><i class="bi bi-person-walking"></i>防災マップ</h1>
    </div>
    <Legends />
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
      height: 15%;
    }
  }

  > ._content {
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;

    > .__control {
      text-align: right;
      i {
        font-size: 25px;
      }
    }
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
